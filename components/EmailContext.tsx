"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UrlSafetyResult {
  url: string;
  isSafe: boolean;
  threatType?: string;
  platformType?: string;
  cacheDuration?: string;
  lastChecked: Date;
}

interface Email {
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  body: string;
  isRead: boolean;
  isPotentialPhishing: boolean;
  phishingScore: number;
  phishingReasons: string[];
  
  // Enhanced analysis fields
  prediction?: string;
  confidence?: number;
  model_used?: string;
  virusTotalResult?: {
    malicious: number;
    total: number;
  };
  googleSafeBrowsingResult?: UrlSafetyResult[];
  heuristicScore?: number;
  mlScore?: number;
}

interface EmailContextType {
  emails: Email[];
  setEmails: (emails: Email[]) => void;
  lastSync: Date | null;
  setLastSync: (date: Date | null) => void;
  addNewEmails: (newEmails: Email[]) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const addNewEmails = useCallback((newEmails: Email[]) => {
    setEmails((prevEmails) => {
      // Create a map of existing email IDs for quick lookup
      const existingIds = new Set(prevEmails.map(email => email.messageId));
      
      // Filter out emails that already exist
      const uniqueNewEmails = newEmails.filter(
        email => !existingIds.has(email.messageId)
      );
      
      // Add new emails to the beginning of the list
      return [...uniqueNewEmails, ...prevEmails];
    });
  }, []);

  return (
    <EmailContext.Provider value={{ emails, setEmails, lastSync, setLastSync, addNewEmails }}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmails() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error("useEmails must be used within an EmailProvider");
  }
  return context;
}