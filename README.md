# Tasklight – React Native To-Do App (TypeScript) + Node/Express/MongoDB API

```
todo-app/
├── backend/   Node.js + Express + MongoDB (Mongoose) + JWT auth
└── mobile/    React Native CLI (TypeScript) source: App.tsx + src/
```

## 1. Run the backend
Requires Node 18+ and MongoDB running locally (or an Atlas URI in `backend/.env`).
```bash
cd backend
npm install
npm run dev          # http://localhost:5000
```
Check: http://localhost:5000/api/health

### API
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | `{email, password}` -> `{token, user}` |
| POST | /api/auth/login | `{email, password}` -> `{token, user}` |
| GET | /api/tasks | list my tasks (JWT) |
| POST | /api/tasks | create task (JWT) |
| PATCH | /api/tasks/:id | update / mark completed (JWT) |
| DELETE | /api/tasks/:id | delete (JWT) |

## 2. Create the React Native app and drop in the code
The RN CLI generates the native Android project, so create it first, then copy this code over it.
```bash
# from the todo-app folder (JDK 17 + Android Studio + emulator required, see reactnative.dev/docs/set-up-your-development-environment)
npx @react-native-community/cli@latest init TodoApp      # TypeScript by default
cd TodoApp

# replace the generated App.tsx and add src/
cp ../mobile/App.tsx ./App.tsx
cp -r ../mobile/src ./src

# dependencies
npm install @reduxjs/toolkit react-redux axios @react-native-async-storage/async-storage \
  @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context @react-native-community/datetimepicker

# start Metro, then in a second terminal run the app on an emulator / USB device
npm start
npx react-native run-android
```
Keep the backend running while using the app.

### Connecting from the app
`src/api/client.ts` uses `http://10.0.2.2:5000/api` (the Android emulator's alias for your PC).
On a real phone use your PC's LAN IP instead, e.g. `http://192.168.1.5:5000/api` (same Wi-Fi), and
allow port 5000 in your firewall. Debug builds allow plain-HTTP by default.

## Features
- Register / login (bcrypt + JWT), session persisted with AsyncStorage, logout
- Add tasks: title, description, date-time, deadline, priority, category
- Mark complete, delete (with confirmation), pull-to-refresh, progress bar
- Filter: All / Active / Done
- Sort: Smart (priority + deadline urgency mix), Deadline, Priority
- Redux Toolkit state (auth + tasks slices, typed hooks)
