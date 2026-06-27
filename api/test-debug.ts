import { GoogleGenAI } from "@google/genai";
import { Pool } from "pg";
import express from "express";
import { initDb } from "../db";

export default function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("Diagnostic test: Import of db.ts succeeded!");
}
