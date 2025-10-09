# 📘 Simple Guide: Adding Calendly for New Analysts

## 🎯 For Non-Technical Users

This is a **super simple** way to get the information needed to connect a new analyst's Calendly calendar to the website.

---

## 🚀 Step-by-Step Process

### Step 1: Ask the Analyst to Get Their Calendly Token

Send this message to the analyst:

> Hi! To connect your Calendly calendar to our booking website, please follow these steps:
> 
> 1. Log in to your Calendly account at https://calendly.com
> 2. Click your profile picture → Go to **Settings**
> 3. In the left sidebar, click **Integrations**
> 4. Click on **API & Webhooks**
> 5. Click the button **"Get a personal access token"**
> 6. **Copy the token** (it's a long string of letters and numbers)
> 7. Send it to me (it will only be shown once, so copy it carefully!)
> 
> ⚠️ **Important**: This token is like a password - only share it with me privately!

### Step 2: Use the Admin Setup Page

1. **Go to this URL** on your website:
   ```
   http://localhost:3000/admin/calendly-setup
   ```
   (Or in production: `https://yourdomain.com/admin/calendly-setup`)

2. **Paste the analyst's access token** into the input box

3. **Click "Get User Info"**

4. **The page will show**:
   - ✅ Analyst's name
   - ✅ Analyst's email
   - ✅ **Calendly User URI** (the important part!)

5. **Click the "Copy" button** next to the User URI

### Step 3: Add to Environment Variables

1. **Open the file** `.env.local` in your project folder

2. **Add a new line** like this:
   ```bash
   CALENDLY_ANALYST_X_URI=paste_the_uri_here
   ```
   
   Replace:
   - `X` with the analyst's ID number (see table below)
   - `paste_the_uri_here` with the URI you copied

3. **Save the file**

4. **Restart your development server**

---

## 📊 Analyst ID Reference

Use these ID numbers when adding to `.env.local`:

| Analyst Name | ID Number | Environment Variable Name |
|--------------|-----------|---------------------------|
| Adnan | 0 | `CALENDLY_ANALYST_0_URI` |
| Assassin | 1 | `CALENDLY_ANALYST_1_URI` ✅ (already configured) |
| Hassan Tariq | 2 | `CALENDLY_ANALYST_2_URI` |
| Hamza Ali | 3 | `CALENDLY_ANALYST_3_URI` |
| Hassan Khan | 4 | `CALENDLY_ANALYST_4_URI` |
| Meower | 5 | `CALENDLY_ANALYST_5_URI` |
| Mohid | 6 | `CALENDLY_ANALYST_6_URI` |
| M. Usama | 7 | `CALENDLY_ANALYST_7_URI` |

---

## 📝 Example: Adding Adnan

**After getting Adnan's User URI from the admin page:**

1. Copy the URI: `https://api.calendly.com/users/12345678-1234-1234-1234-123456789012`

2. Open `.env.local` and add:
   ```bash
   CALENDLY_ANALYST_0_URI=https://api.calendly.com/users/12345678-1234-1234-1234-123456789012
   ```

3. Save the file

4. Restart the server

5. **Done!** Adnan's Calendly is now connected ✅

---

## ✅ Verification

To verify it's working:

1. Go to `/meetings` page
2. Select the analyst you just added
3. Check if:
   - ✅ Meeting types load from their Calendly
   - ✅ Calendar shows their available dates
   - ✅ Time slots show their availability

---

## 🔒 Security Notes

**For the Admin:**
- The setup page (`/admin/calendly-setup`) should be **password protected** in production
- Never share the access tokens publicly
- Store the `.env.local` file securely (never commit to Git)

**For the Analyst:**
- The access token gives full API access to their Calendly
- They can regenerate it anytime if compromised
- They should only share it with trusted admins

---

## 🎯 Quick Checklist

When adding a new analyst with Calendly:

- [ ] Analyst has a Calendly account
- [ ] Analyst created event types (meeting types) in Calendly
- [ ] Analyst configured their availability
- [ ] Analyst generated Personal Access Token
- [ ] Used admin setup page to get User URI
- [ ] Added URI to `.env.local` with correct ID number
- [ ] Restarted the development server
- [ ] Tested on `/meetings` page
- [ ] Verified booking popup works
- [ ] Confirmed booking appears in analyst's Calendly calendar

---

## 🆘 Troubleshooting

### "Invalid access token" error
- Token was copied incorrectly (check for spaces)
- Token was regenerated (get a new one)
- Analyst's Calendly account has issues

### "User URI not working"
- Double-check the analyst ID number matches
- Make sure there are no typos in the URI
- Verify the `.env.local` file was saved
- Restart the server after adding the URI

### "Meeting types not showing"
- Analyst needs to create event types in Calendly
- Event types must be marked as "Active"
- Availability must be configured

---

## 💡 Pro Tips

1. **Create a spreadsheet** to track which analysts have Calendly configured
2. **Save access tokens securely** (password manager) in case you need to verify later
3. **Test each analyst** after adding them to ensure everything works
4. **Document any custom event types** each analyst creates

---

**Need Help?** Contact your developer with:
- Screenshots from the admin setup page
- The analyst ID you're trying to add
- Any error messages you see

---

**Last Updated**: October 9, 2025  
**Page URL**: `/admin/calendly-setup`

