# Habit Dashboard

Clean, minimal dashboard for your Telegram habit bot.  
Reads from **Google Sheets** (3 tabs: Users / Habits / Checkins).

---

## Quick Start

```bash
npm install
cp .env.example .env.local
# fill in GOOGLE_SHEETS_ENDPOINT (see below)
npm run dev
```

---

## Your Google Sheets Structure

### Tab: Checkins  ← main data source

| user_id   | habit_name      | date       | time  | status | weekday  |
|-----------|-----------------|------------|-------|--------|----------|
| 871419921 | Сон             | 2026-03-16 | 17:01 | done   | Monday   |
| 871419921 | вставать 5 утро | 2026-03-16 | 19:26 | done   | Monday   |
| 871419921 | □ Чтение книг   | 2026-03-16 | 19:26 | done   | Monday   |

**Status values accepted:** `done` / `skip` / `pending`  
**Date format:** `YYYY-MM-DD`  
**Time format:** `HH:MM`  
Emoji prefixes in habit_name are stripped automatically.

### Tab: Habits (optional, for categories)

| user_id   | habit_name      | category    |
|-----------|-----------------|-------------|
| 871419921 | Сон             | Health      |
| 871419921 | вставать 5 утро | Discipline  |

### Tab: Users (optional)

| user_id   | username | created_at |
|-----------|----------|------------|
| 871419921 | @yourname| 2026-01-01 |

---

## Apps Script Setup

In your Google Sheet → **Extensions → Apps Script** → paste this code:

```javascript
function doGet(e) {
  var ss      = SpreadsheetApp.getActiveSpreadsheet();
  var checkins = ss.getSheetByName('Checkins');
  var habitsSheet = ss.getSheetByName('Habits');

  var userId = e.parameter.user_id;

  // --- Read Checkins ---
  var cData    = checkins.getDataRange().getValues();
  var cHeaders = cData[0]; // [user_id, habit_name, date, time, status, weekday]

  // --- Read Habits for category lookup ---
  var catMap = {};
  if (habitsSheet) {
    var hData    = habitsSheet.getDataRange().getValues();
    var hHeaders = hData[0];
    var hUidIdx  = hHeaders.indexOf('user_id');
    var hNameIdx = hHeaders.indexOf('habit_name');
    var hCatIdx  = hHeaders.indexOf('category');
    for (var i = 1; i < hData.length; i++) {
      if (!hData[i][hNameIdx]) continue;
      catMap[String(hData[i][hNameIdx]).trim().toLowerCase()] =
        hCatIdx >= 0 ? hData[i][hCatIdx] : 'General';
    }
  }

  // --- Column indices for Checkins ---
  var uidIdx     = cHeaders.indexOf('user_id');
  var nameIdx    = cHeaders.indexOf('habit_name');
  var dateIdx    = cHeaders.indexOf('date');
  var timeIdx    = cHeaders.indexOf('time');
  var statusIdx  = cHeaders.indexOf('status');
  var weekdayIdx = cHeaders.indexOf('weekday');

  var rows = [];
  for (var r = 1; r < cData.length; r++) {
    var row = cData[r];
    if (!row[uidIdx] && !row[nameIdx]) continue; // skip empty rows

    // Filter by user_id if provided
    if (userId && String(row[uidIdx]) !== String(userId)) continue;

    var habitName = String(row[nameIdx] || '').trim();
    var dateVal   = row[dateIdx];

    // Format date as YYYY-MM-DD
    var dateStr = '';
    if (dateVal instanceof Date) {
      dateStr = Utilities.formatDate(dateVal, 'UTC', 'yyyy-MM-dd');
    } else {
      dateStr = String(dateVal).trim();
    }

    // Format time as HH:MM
    var timeVal = row[timeIdx];
    var timeStr = '';
    if (timeVal instanceof Date) {
      timeStr = Utilities.formatDate(timeVal, 'UTC', 'HH:mm');
    } else {
      timeStr = String(timeVal || '').trim();
    }

    rows.push({
      user_id:    String(row[uidIdx] || ''),
      habit_name: habitName,
      date:       dateStr,
      time:       timeStr,
      status:     String(row[statusIdx] || 'done').toLowerCase().trim(),
      weekday:    String(row[weekdayIdx] || '').trim(),
      category:   catMap[habitName.replace(/^[\u{1F300}-\u{1F9FF}\s]+/u, '').trim().toLowerCase()] || 'General',
    });
  }

  var output = ContentService
    .createTextOutput(JSON.stringify({ rows: rows, total: rows.length }))
    .setMimeType(ContentService.MimeType.JSON);

  return output;
}
```

### Deploy:
1. Click **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** → copy the URL

### Test in browser:
```
https://script.google.com/macros/s/YOUR_ID/exec
# With user filter:
https://script.google.com/macros/s/YOUR_ID/exec?user_id=871419921
```

Should return:
```json
{
  "rows": [
    { "user_id": "871419921", "habit_name": "Сон", "date": "2026-03-16",
      "time": "17:01", "status": "done", "weekday": "Monday", "category": "General" }
  ],
  "total": 5
}
```

---

## Configure .env

```env
DATA_SOURCE=google_sheets
GOOGLE_SHEETS_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
REFRESH_INTERVAL_MS=60000
NEXT_PUBLIC_ENABLE_AUTO_REFRESH=true
```

---

## Deploy to Vercel

```bash
npx vercel
```

Add env vars in Vercel dashboard → Settings → Environment Variables.

---

## How your Telegram bot writes rows

Each time user does `/done Сон`, your bot appends to **Checkins**:

```python
import gspread
from datetime import datetime

def log_checkin(user_id, habit_name, status='done'):
    gc    = gspread.service_account(filename='credentials.json')
    ws    = gc.open('HabitTracker').worksheet('Checkins')
    now   = datetime.now()
    ws.append_row([
        str(user_id),                          # user_id
        habit_name,                            # habit_name
        now.strftime('%Y-%m-%d'),              # date
        now.strftime('%H:%M'),                 # time
        status,                                # done / skip
        now.strftime('%A'),                    # weekday (Monday, ...)
    ])
```

---

## Open dashboard from bot

```python
DASHBOARD_URL = 'https://your-dashboard.vercel.app'

@bot.message_handler(commands=['report'])
def send_report(message):
    uid = message.from_user.id
    url = f'{DASHBOARD_URL}?uid={uid}'
    # As inline button (Mini App):
    from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton('Dashboard', web_app=WebAppInfo(url=url)))
    bot.send_message(message.chat.id, 'Your progress:', reply_markup=markup)
```
