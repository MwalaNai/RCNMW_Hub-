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

---

# Setting up notifications (WhatsApp & Email)

The app can remind participants about a meeting from the meeting detail
view ("Notify participants"). WhatsApp and email work differently — read
both sections below before you deploy.

## WhatsApp — works immediately, no setup needed
There's no free way for a website to send a WhatsApp message completely
automatically — that requires WhatsApp's paid Business API and a verified
business account. Instead, the app opens a pre-filled WhatsApp chat
(`wa.me` link) for each selected recipient; you (or whoever's logged in as
organizer) just tap **Send** in WhatsApp itself. It's one tap per person,
but nothing to configure.

For this to work, each member needs their **WhatsApp number in
international format** in the Members page — country code first, no
leading `+` or `0`. Example for a Malawi number `099 123 4567`, enter it as
`265991234567`.

## Email — two options

**Option A: do nothing (default).** Clicking "Email selected" opens your
device's email app with the message and all selected recipients already
filled in — you just hit send. Zero setup, works everywhere, but it's a
manual send from your own inbox each time.

**Option B: enable one-click automatic sending with EmailJS (free).**
This sends directly from the app to everyone selected, no email app
required.

1. Go to https://www.emailjs.com and create a free account (200 emails／month
   on the free plan).
2. Under **Email Services**, connect an email account (Gmail, Outlook, or
   others) — this is the account emails will be sent *from*.
3. Under **Email Templates**, create a new template. It needs to reference
   three variables the app sends: `{{to_email}}`, `{{to_name}}`,
   `{{subject}}`, and `{{message}}`. A simple template body works fine:
   ```
   Subject: {{subject}}

   Hi {{to_name}},

   {{message}}
   ```
4. Under **Account > General**, copy your **Public Key**.
5. Open `index.html` in a text editor and find the `CONFIG.EMAILJS` block
   near `CONFIG.FIREBASE`. Paste in:
   - `publicKey` — from step 4
   - `serviceId` — from your Email Service in step 2
   - `templateId` — from your Template in step 3
6. Re-deploy `index.html` as usual.

Once configured, "Email selected" sends immediately to everyone checked
who has an email address on file — no confirmation step, so double-check
the recipient list before clicking.

