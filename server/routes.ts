import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import bcrypt from "bcrypt";
import { createSessionMiddleware } from "./session";
import { storage } from "./storage";
import { auctionService } from "./services/auction-service";
import { timerService } from "./services/timer-service";
import { botService } from "./services/bot-service";
import { setSocketIO } from "./socket";
import { insertUserSchema, insertAuctionSchema, insertBotSchema, insertSettingsSchema } from "@shared/schema";
import { z } from "zod";

// Multilingual error messages
const errorMessages = {
  ru: {
    invalidCredentials: "Неверные учетные данные",
    unauthorized: "Не авторизован",
    userAlreadyExists: "Пользователь уже существует",
    registrationError: "Ошибка регистрации",
    invalidData: "Неверные данные",
    userNotFound: "Пользователь не найден",
  },
  en: {
    invalidCredentials: "Invalid credentials",
    unauthorized: "Unauthorized",
    userAlreadyExists: "User already exists",
    registrationError: "Registration error",
    invalidData: "Invalid data",
    userNotFound: "User not found",
  },
  ka: {
    invalidCredentials: "არასწორი სავისე მონაცემები",
    unauthorized: "არაავტორიზებული",
    userAlreadyExists: "მომხმარებელი უკვე არსებობს",
    registrationError: "რეგისტრაციის შეცდომა",
    invalidData: "არასწორი მონაცემები",
    userNotFound: "მომხმარებელი ვერ მოიძებნა",
  },
};

// Helper function to get error message in user's preferred language
function getErrorMessage(req: any, key: keyof typeof errorMessages.ru): string {
  const acceptLanguage = req.headers['accept-language'] || '';
  let lang = 'ru'; // default to Russian
  
  if (acceptLanguage.includes('en')) {
    lang = 'en';
  } else if (acceptLanguage.includes('ka')) {
    lang = 'ka';
  }
  
  return errorMessages[lang as keyof typeof errorMessages][key];
}

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware with PostgreSQL storage
  app.use(createSessionMiddleware());

  const httpServer = createServer(app);

  // Socket.IO setup
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Set the io instance for other services to use
  setSocketIO(io);

  // Authentication routes
  // Live validation endpoints
  app.post("/api/auth/validate-username", async (req, res) => {
    try {
      const { username } = z.object({
        username: z.string().min(3, "მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"),
      }).parse(req.body);

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.json({ valid: false, message: "მომხმარებლის სახელი დაკავებულია" });
      }

      res.json({ valid: true, message: "მომხმარებლის სახელი ხელმისაწვდომია" });
    } catch (error: any) {
      if (error.errors) {
        return res.json({ valid: false, message: error.errors[0].message });
      }
      res.json({ valid: false, message: "არასწორი მომხმარებლის სახელი" });
    }
  });

  app.post("/api/auth/validate-email", async (req, res) => {
    try {
      const { email } = z.object({
        email: z.string().email("არასწორი ელ-ფოსტის ფორმატი"),
      }).parse(req.body);

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.json({ valid: false, message: "ელ-ფოსტა უკვე რეგისტრირებულია" });
      }

      res.json({ valid: true, message: "ელ-ფოსტა ხელმისაწვდომია" });
    } catch (error: any) {
      if (error.errors) {
        return res.json({ valid: false, message: error.errors[0].message });
      }
      res.json({ valid: false, message: "არასწორი ელ-ფოსტის ფორმატი" });
    }
  });

  app.post("/api/auth/validate-phone", async (req, res) => {
    try {
      const { phone } = z.object({
        phone: z.string().regex(/^\+995\d{9}$/, "ნომერი უნდა იყოს ფორმატში +995XXXXXXXXX"),
      }).parse(req.body);

      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.json({ valid: false, message: "ტელეფონის ნომერი უკვე რეგისტრირებულია" });
      }

      res.json({ valid: true, message: "ტელეფონის ნომერი ხელმისაწვდომია" });
    } catch (error: any) {
      if (error.errors) {
        return res.json({ valid: false, message: error.errors[0].message });
      }
      res.json({ valid: false, message: "არასწორი ნომრის ფორმატი" });
    }
  });

app.post("/api/auth/register", async (req, res) => {
  console.log("Received registration request body:", req.body);
  try {
    const registerSchema = z.object({
        username: z.string({ required_error: "მომხმარებლის სახელი სავალდებულოა" })
          .min(3, "მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"),
        email: z.string({ required_error: "ელ-ფოსტა სავალდებულოა" })
          .email("არასწორი ელ-ფოსტის ფორმატი"),
        password: z.string({ required_error: "პაროლი სავალდებულოა" })
          .min(6, "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს"),
        firstName: z.string().optional().nullable(),
        lastName: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        dateOfBirth: z.string().optional().nullable(),
        gender: z.enum(["male", "female", "other"]).optional().nullable(),
        agreeToPrivacyPolicy: z.boolean({ required_error: "კონფიდენციალურობის პოლიტიკაზე დათანხმება სავალდებულოა" }),
        confirmAge: z.boolean({ required_error: "უნდა დაადასტუროთ, რომ ხართ 18 წლის ან მეტის" }),
      });

    console.log("Validating with schema:", registerSchema);
    const registerData = registerSchema.parse(req.body);
      
      // Check for existing users
      const existingUsername = await storage.getUserByUsername(registerData.username);
      if (existingUsername) {
        return res.status(400).json({ error: getErrorMessage(req, 'userAlreadyExists') });
      }

      const existingEmail = await storage.getUserByEmail(registerData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "ელ-ფოსტა უკვე რეგისტრირებულია" });
      }

      // Check phone if provided
      if (registerData.phone) {
        const existingPhone = await storage.getUserByPhone(registerData.phone);
        if (existingPhone) {
          return res.status(400).json({ error: "ტელეფონის ნომერი უკვე რეგისტრირებულია" });
        }
      }

      // Validate age if date of birth is provided
      if (registerData.dateOfBirth) {
        const birthDate = new Date(registerData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
          ? age - 1 
          : age;
        
        if (actualAge < 18) {
          return res.status(400).json({ error: "რეგისტრაციისთვის თქვენ უნდა იყოთ მინიმუმ 18 წლის" });
        }
      }

      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection as any)?.socket?.remoteAddress;
      const user = await storage.createUser({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        username: registerData.username,
        email: registerData.email,
        phone: registerData.phone,
        password: hashedPassword,
        dateOfBirth: registerData.dateOfBirth ? new Date(registerData.dateOfBirth) : undefined,
        gender: registerData.gender,
        bidBalance: 5, // Starting bid balance
        role: "user",
        ipAddress: ipAddress,
      });

      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({ user: { id: user.id, username: user.username, bidBalance: user.bidBalance, role: user.role } });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.errors) {
        // Get all validation error messages
        const errorMessages = error.errors.map((err: { message: string }) => err.message).join(", ");
        return res.status(400).json({ error: errorMessages });
      }
      res.status(400).json({ error: getErrorMessage(req, 'registrationError') });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string(),
      }).parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: getErrorMessage(req, 'invalidCredentials') });
      }

      // Update IP address on login
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection as any)?.socket?.remoteAddress;
      await storage.updateUserIpAddress(user.id, ipAddress);

      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({ user: { id: user.id, username: user.username, bidBalance: user.bidBalance, role: user.role } });
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(req, 'invalidData') });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    console.log("User ID from session:", req.session.userId);
    
    if (!req.session.userId) {
      return res.status(401).json({ error: getErrorMessage(req, 'unauthorized') });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: getErrorMessage(req, 'userNotFound') });
    }

    res.json({ user: { id: user.id, username: user.username, bidBalance: user.bidBalance, role: user.role } });
  });

  // Auction routes
  app.get("/api/auctions", async (req, res) => {
    const { status } = req.query;
    
    if (status && typeof status === "string") {
      const auctions = await storage.getAuctionsByStatus(status as any);
      return res.json(auctions);
    }

    const upcoming = await storage.getAuctionsByStatus("upcoming");
    const live = await storage.getAuctionsByStatus("live");
    // For finished auctions, only show today's winners
    const allFinished = await storage.getAuctionsByStatus("finished");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow
    
    const finished = allFinished.filter(auction => {
      if (!auction.endTime) return false;
      const endTime = new Date(auction.endTime);
      return endTime >= today && endTime < tomorrow;
    });

    // Add bot winner information to finished auctions
    const finishedWithBotWinners = await Promise.all(
      finished.map(async (auction) => {
        // If auction has no winner_id, check if it was won by a bot
        if (!auction.winnerId) {
          const lastBotBid = await storage.getLastBotBidForAuction(auction.id);
          if (lastBotBid && lastBotBid.botId) {
            const bot = await storage.getBot(lastBotBid.botId);
            if (bot) {
              return {
                ...auction,
                winner: {
                  id: bot.id,
                  username: bot.username,
                  firstName: bot.firstName,
                  lastName: bot.lastName
                }
              };
            }
          }
        }
        return auction;
      })
    );

    // Add prebids count to upcoming auctions
    const upcomingWithPrebids = await Promise.all(
      upcoming.map(async (auction) => {
        const prebids = await storage.getPrebidsForAuction(auction.id);
        return {
          ...auction,
          prebidsCount: prebids.length
        };
      })
    );

    res.json({ upcoming: upcomingWithPrebids, live, finished: finishedWithBotWinners });
  });

  app.get("/api/auctions/:id", async (req, res) => {
    const auction = await storage.getAuction(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: "აუქციონი ვერ მოიძებნა" });
    }
    res.json(auction);
  });

  app.get("/api/auctions/slug/:slug", async (req, res) => {
    const allAuctions = await storage.getAllAuctions();
    const createSlug = (title: string, displayId: string): string => {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9а-я\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 35);
      // Add displayId for uniqueness (e.g., QB-7029)
      const cleanDisplayId = displayId.replace(/[/\\]/g, '-').toLowerCase();
      return `${baseSlug}-${cleanDisplayId}`;
    };
    
    const auction = allAuctions.find(a => createSlug(a.title, a.displayId) === req.params.slug);
    if (!auction) {
      return res.status(404).json({ error: "აუქციონი ვერ მოიძებნა" });
    }
    res.json(auction);
  });

  app.post("/api/auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const auctionData = insertAuctionSchema.parse(req.body);
      const auction = await storage.createAuction(auctionData);
      res.json(auction);
    } catch (error) {
      res.status(400).json({ error: "აუქციონის არასწორი მონაცემები" });
    }
  });

  app.post("/api/auctions/:id/bid", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }

    const success = await auctionService.placeBid(req.params.id, req.session.userId);
    
    if (!success) {
      return res.status(400).json({ error: "ფსონის დადება ვერ მოხერხდა" });
    }

    // Broadcast bid update
    const auction = await storage.getAuction(req.params.id);
    const bids = await storage.getBidsForAuction(req.params.id);
    const timers = timerService.getAllTimers();

    io.emit("auctionUpdate", { auction, bids: bids.slice(0, 5), timers });

    res.json({ success: true });
  });

  app.post("/api/auctions/:id/prebid", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }

    const result = await auctionService.placePrebid(req.params.id, req.session.userId);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ success: true });
  });

  // Bids routes
  app.get("/api/bids/recent", async (req, res) => {
    const bids = await storage.getRecentBids(20);
    res.json(bids);
  });

  app.get("/api/bids/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }
    
    const bids = await storage.getUserBids(req.session.userId, 50);
    res.json(bids);
  });

  app.get("/api/prebids/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }
    
    const prebids = await storage.getUserPrebids(req.session.userId, 50);
    res.json(prebids);
  });

  app.get("/api/auctions/:id/bids", async (req, res) => {
    const bids = await storage.getBidsForAuction(req.params.id);
    res.json(bids);
  });

  app.get("/api/auctions/slug/:slug/bids", async (req, res) => {
    const allAuctions = await storage.getAllAuctions();
    const createSlug = (title: string, displayId: string): string => {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9а-я\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 35);
      // Add displayId for uniqueness (e.g., QB-7029)
      const cleanDisplayId = displayId.replace(/[/\\]/g, '-').toLowerCase();
      return `${baseSlug}-${cleanDisplayId}`;
    };
    
    const auction = allAuctions.find(a => createSlug(a.title, a.displayId) === req.params.slug);
    if (!auction) {
      return res.status(404).json({ error: "აუქციონი ვერ მოიძებნა" });
    }
    
    const bids = await storage.getBidsForAuction(auction.id);
    res.json(bids);
  });

  // Auction statistics endpoint
  app.get("/api/auctions/:id/stats", async (req, res) => {
    const allBids = await storage.getBidsForAuction(req.params.id);
    // Count only actual bids, exclude prebids for bid numbering
    const actualBids = allBids.filter(bid => !bid.isPrebid);
    const uniqueParticipants = new Set(actualBids.map(bid => bid.isBot ? bid.botName : bid.user?.username)).size;
    
    const auction = await storage.getAuction(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: "აუქციონი ვერ მოიძებნა" });
    }

    const stats = {
      totalBids: actualBids.length, // Only count actual bids for numbering
      uniqueParticipants,
      priceIncrease: parseFloat(auction.currentPrice).toFixed(2)
    };
    
    res.json(stats);
  });

  // Public route to check auction bots (for debugging)
  app.get("/api/auctions/:id/bots", async (req, res) => {
    const auctionBots = await botService.getAuctionBots(req.params.id);
    res.json(auctionBots);
  });

  app.get("/api/auctions/slug/:slug/stats", async (req, res) => {
    const allAuctions = await storage.getAllAuctions();
    const createSlug = (title: string, displayId: string): string => {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9а-я\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 35);
      // Add displayId for uniqueness (e.g., QB-7029)
      const cleanDisplayId = displayId.replace(/[/\\]/g, '-').toLowerCase();
      return `${baseSlug}-${cleanDisplayId}`;
    };
    
    const auction = allAuctions.find(a => createSlug(a.title, a.displayId) === req.params.slug);
    if (!auction) {
      return res.status(404).json({ error: "აუქციონი ვერ მოიძებნა" });
    }
    
    const allBids = await storage.getBidsForAuction(auction.id);
    const uniqueParticipants = new Set(allBids.map(bid => bid.isBot ? bid.botName : bid.user?.username)).size;

    const stats = {
      totalBids: allBids.length,
      uniqueParticipants,
      priceIncrease: parseFloat(auction.currentPrice).toFixed(2)
    };
    
    res.json(stats);
  });

  // User stats
  app.get("/api/users/stats", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }

    const stats = await storage.getUserStats(req.session.userId);
    res.json(stats);
  });

  // User profile
  app.get("/api/users/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user);
  });

  app.put("/api/users/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }

    try {
      const inputData = z.object({
        firstName: z.string().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
        lastName: z.string().min(2, "გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
        email: z.string().email("შეიყვანეთ სწორი ელ-ფოსტა").optional(),
        phone: z.string().regex(/^\+995\d{9}$/, "შეიყვანეთ ნომერი ფორმატში +995XXXXXXXXX").optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
      }).parse(req.body);

      const updateData = {
        ...inputData,
        dateOfBirth: inputData.dateOfBirth ? new Date(inputData.dateOfBirth) : undefined,
      };

      const updatedUser = await storage.updateUser(req.session.userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
      }

      res.json(updatedUser);
    } catch (error: any) {
      console.error("Profile update error:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: "არასწორი მონაცემები" });
    }
  });

  // User won auctions
  app.get("/api/users/won-auctions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }

    const wonAuctions = await storage.getUserWonAuctions(req.session.userId);
    res.json(wonAuctions);
  });

  // User recent bids
  app.get("/api/users/recent-bids", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "არაავტორიზებული" });
    }

    const recentBids = await storage.getUserRecentBids(req.session.userId);
    res.json(recentBids);
  });

  // Admin routes
  app.get("/api/admin/bot-settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    const settings = await storage.getBotSettings();
    res.json(settings);
  });

  app.put("/api/admin/bot-settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const settings = await storage.updateBotSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "არასწორი პარამეტრები" });
    }
  });

  // Admin auction management routes
  app.get("/api/admin/auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    const auctions = await storage.getAllAuctions();
    res.json(auctions);
  });

  app.get("/api/admin/finished-auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    const finishedAuctions = await storage.getAuctionsByStatus("finished");
    
    // Add bot winner information to finished auctions
    const finishedWithBotWinners = await Promise.all(
      finishedAuctions.map(async (auction) => {
        // If auction has no winner_id, check if it was won by a bot
        if (!auction.winnerId) {
          const lastBotBid = await storage.getLastBotBidForAuction(auction.id);
          if (lastBotBid && lastBotBid.botId) {
            const bot = await storage.getBot(lastBotBid.botId);
            if (bot) {
              return {
                ...auction,
                winner: {
                  id: bot.id,
                  username: bot.username,
                  firstName: bot.firstName,
                  lastName: bot.lastName
                }
              };
            }
          }
        }
        return auction;
      })
    );

    res.json(finishedWithBotWinners);
  });

  app.get("/api/admin/auction-stats/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const stats = await storage.getAuctionDetailedStats(req.params.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching auction stats:", error);
      res.status(500).json({ error: "აუქციონის სტატისტიკის მიღების შეცდომა" });
    }
  });

  app.delete("/api/admin/auctions/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      console.log("Attempting to delete auction:", req.params.id);
      await storage.deleteAuction(req.params.id);
      console.log("Successfully deleted auction:", req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting auction:", error);
      res.status(500).json({ error: "აუქციონის წაშლის შეცდომა" });
    }
  });

  app.post("/api/admin/auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      console.log("Received auction data:", req.body);
      
      // Convert data types to match schema expectations
      const processedData = {
        ...req.body,
        retailPrice: req.body.retailPrice?.toString() || "0",
        startTime: new Date(req.body.startTime)
      };
      
      const auctionData = insertAuctionSchema.parse(processedData);
      console.log("Parsed auction data:", auctionData);
      const auction = await storage.createAuction(auctionData);
      res.json(auction);
    } catch (error) {
      console.error("Auction validation error:", error);
      res.status(400).json({ error: "აუქციონის არასწორი მონაცემები" });
    }
  });

  app.put("/api/admin/auctions/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      // Convert data types to match schema expectations
      const processedData = { ...req.body };
      if (req.body.retailPrice !== undefined) {
        processedData.retailPrice = req.body.retailPrice?.toString() || "0";
      }
      if (req.body.startTime !== undefined) {
        processedData.startTime = new Date(req.body.startTime);
      }
      
      const auctionData = insertAuctionSchema.partial().parse(processedData);
      const auction = await storage.updateAuction(req.params.id, auctionData);
      res.json(auction);
    } catch (error) {
      console.error("Auction update validation error:", error);
      res.status(400).json({ error: "აუქციონის არასწორი მონაცემები" });
    }
  });

  app.delete("/api/admin/auctions/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      console.log("Attempting to delete auction:", req.params.id);
      await storage.deleteAuction(req.params.id);
      console.log("Successfully deleted auction:", req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting auction:", error);
      res.status(500).json({ error: "აუქციონის წაშლის შეცდომა" });
    }
  });

  app.post("/api/admin/auctions/:id/start", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      await auctionService.startAuction(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error starting auction:", error);
      res.status(500).json({ error: "აუქციონის დაწყების შეცდომა" });
    }
  });

  app.post("/api/admin/auctions/:id/end", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    await auctionService.endAuction(req.params.id);
    res.json({ success: true });
  });

  // Bot management routes (Admin only)
  app.get("/api/admin/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }
    
    const bots = await botService.getAllBots();
    res.json(bots);
  });

  app.post("/api/admin/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const botData = insertBotSchema.parse(req.body);
      const bot = await botService.createBot(botData);
      res.json(bot);
    } catch (error) {
      console.error("Bot creation error:", error);
      res.status(400).json({ error: "ბოტის არასწორი მონაცემები" });
    }
  });

  app.put("/api/admin/bots/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const botData = insertBotSchema.partial().parse(req.body);
      const bot = await botService.updateBot(req.params.id, botData);
      res.json(bot);
    } catch (error) {
      console.error("Bot update error:", error);
      res.status(400).json({ error: "ბოტის არასწორი მონაცემები" });
    }
  });

  app.delete("/api/admin/bots/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    await botService.deleteBot(req.params.id);
    res.json({ success: true });
  });

  // Auction bot management routes
  app.get("/api/admin/auctions/:auctionId/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }
    
    const auctionBots = await botService.getAuctionBots(req.params.auctionId);
    res.json(auctionBots);
  });

  app.post("/api/admin/auctions/:auctionId/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    const { botId, bidLimit = 0 } = req.body;
    await botService.addBotToAuction(req.params.auctionId, botId, bidLimit);
    res.json({ success: true });
  });

  app.delete("/api/admin/auctions/:auctionId/bots/:botId", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    await botService.removeBotFromAuction(req.params.auctionId, req.params.botId);
    res.json({ success: true });
  });

  // Get all bots with their current auction status
  app.get("/api/admin/bots/auction-status", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }
    
    try {
      const botsWithStatus = await botService.getBotsWithAuctionStatus();
      res.json(botsWithStatus);
    } catch (error) {
      console.error("Error fetching bots with auction status:", error);
      res.status(500).json({ error: "Failed to fetch bots with auction status" });
    }
  });

  // Admin user management routes
  app.get("/api/admin/users", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || "";

      console.log("Fetching users with params:", { page, limit, search });
      const users = await storage.getUsersWithStats(page, limit, search);
      console.log("Users fetched with stats:", JSON.stringify(users, null, 2));
      
      // Add cache-busting header to force refresh
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "მომხმარებლების მიღების შეცდომა" });
    }
  });

  app.get("/api/admin/users/today-registrations", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const todayCount = await storage.getTodayRegistrations();
      res.json({ count: todayCount });
    } catch (error) {
      console.error("Error fetching today's registrations:", error);
      res.status(500).json({ error: "რეგისტრაციების მონაცემების მიღების შეცდომა" });
    }
  });

  app.get("/api/admin/users/:id/activity", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const userId = req.params.id;
      const activity = await storage.getUserAuctionActivity(userId);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ error: "მომხმარებლის აქტივობის მიღების შეცდომა" });
    }
  });

  // Update user
  app.patch("/api/admin/users/:userId", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const userId = req.params.userId;
      const updateData = z.object({
        username: z.string().min(3).optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        balance: z.number().optional(),
        role: z.enum(["user", "admin"]).optional(),
      }).parse(req.body);

      const updatedUser = await storage.updateUser(userId, updateData);
      res.json({ user: updatedUser });
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "მომხმარებლის განახლების შეცდომა" });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:userId", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const userId = req.params.userId;
      
      // Prevent admin from deleting themselves
      if (userId === req.session.userId) {
        return res.status(400).json({ error: "საკუთარი ანგარიშის წაშლა შეუძლებელია" });
      }

      await storage.deleteUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "მომხმარებლის წაშლის შეცდომა" });
    }
  });

  // Admin Settings routes
  app.get("/api/admin/settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "პარამეტრების მიღების შეცდომა" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }

    try {
      const updateData = insertSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateSettings(updateData);
      res.json(updatedSettings);
    } catch (error: any) {
      console.error("Error updating settings:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "პარამეტრების განახლების შეცდომა" });
    }
  });

  // Public Settings route (for all users)
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching public settings:", error);
      res.status(500).json({ error: "პარამეტრების მიღების შეცდომა" });
    }
  });

  // Real-time timer updates
  app.get("/api/timers", (req, res) => {
    const timers = timerService.getAllTimers();
    res.json(timers);
  });

  // Socket.IO real-time updates
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinAuction", (auctionId) => {
      socket.join(`auction-${auctionId}`);
    });

    socket.on("leaveAuction", (auctionId) => {
      socket.leave(`auction-${auctionId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Periodic updates for timers and auction status
  setInterval(async () => {
    const timers = timerService.getAllTimers();
    io.emit("timerUpdate", timers);

    // Also emit full auction updates every 2 seconds for real-time bid history
    try {
      const liveAuctions = await storage.getAuctionsByStatus("live");
      for (const auction of liveAuctions) {
        const bids = await storage.getBidsForAuction(auction.id);
        io.emit("auctionUpdate", { 
          auction, 
          bids: bids.slice(0, 5), 
          timers 
        });
      }
    } catch (error) {
      console.error("Error in periodic auction updates:", error);
    }

    // Check for auctions that should start
    await auctionService.checkUpcomingAuctions();
  }, 1000);

  return httpServer;
}
