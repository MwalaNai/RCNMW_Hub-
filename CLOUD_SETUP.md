# Setting up cloud sync (Firebase — free)

This lets everyone who installs the app see the same members, meetings, and
attendance records in real time, on any device.

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click **Add project**, give it any name (e.g. "call-attendance"), and
   finish the setup wizard (you can disable Google Analytics, it's not needed).

## 2. Create a Firestore database
1. In the left sidebar, click **Build > Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** for now (we'll apply the rules below right
   after) and pick any region close to you.

## 3. Apply the security rules
1. In Firestore, go to the **Rules** tab.
2. Replace the contents with what's in `firestore.rules` (included in this
   zip) and click **Publish**.

   Note: these rules allow anyone with your Firebase config to read and
   write the shared document — there's no login system here. That's fine for
   a small trusted group, but don't publish your Firebase config publicly
   beyond your organizers. The in-app PIN still gates who can *edit* through
   the app's UI; the sync itself is open by design to keep this simple and free.

## 4. Register a web app and get your config
1. Back on the project overview page, click the **</>** (web) icon to add a
   web app.
2. Give it any nickname, click **Register app**. You do NOT need Firebase
   Hosting for this — skip that step.
3. You'll see a code block with a `firebaseConfig` object like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "call-attendance-xxxxx.firebaseapp.com",
     projectId: "call-attendance-xxxxx",
     storageBucket: "call-attendance-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

## 5. Paste your config into the app
1. Open `index.html` in a text editor.
2. Find the `CONFIG.FIREBASE` block near the top of the `<script>` section.
3. Replace the placeholder values with the ones from step 4.
4. Also change `EDIT_PIN` to your own PIN while you're in there.

## 6. Re-deploy
Upload the updated `index.html` (along with the other files) to your GitHub
Pages repo, replacing the old version. Once it's live, everyone who opens the
app — or already has it installed — will see live, shared data.

## Free tier limits (Firestore Spark plan)
For a small group tracker this is effectively unlimited: 50,000 reads,
20,000 writes, and 20,000 deletes per day, plus 1 GiB stored. You'd need a
very large, very active group to come close to hitting these.
