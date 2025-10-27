# Connectly

## Project purpose
- Connectly is a language‑exchange social app: users sign up, onboard their language preferences, find and befriend partners, and communicate in real time via chat and video (Stream API).
- Goal: lightweight UX for matching learners with native speakers and enabling voice/video practice.

## High‑level architecture
- Frontend: 
React (Vite). Responsible for UI, routing, auth state, calling backend APIs, and connecting to Stream with a client token.

- Backend: 
Express + Node. Provides REST API controllers for auth, users/friends, chat token generation, and Stream server‑side integration.
Database: MongoDB for users, friend requests, and related state.
Realtime media: Stream (GetStream) for chat and video; backend creates/upserts Stream user records and issues tokens.

## key-flow

- Signup/Login: frontend calls backend auth controllers. Backend validates, stores user, returns JWT. Frontend stores token (axiosInstance uses it).
- Onboarding: user updates profile (languages, interests). Backend updates user and calls upsertStreamUser to ensure a Stream identity exists.
- Friend system: sendFriendRequest, acceptFriendRequest, list incoming/outgoing/accepted friends via userController endpoints.
- Chat / Video setup: frontend requests a Stream client token from backend (getStreamToken). Backend uses STREAM_SECRET to generate a secure token for the Stream user and returns it. Frontend connects to Stream with VITE_STREAM_KEY + token.