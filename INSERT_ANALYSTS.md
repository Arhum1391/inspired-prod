# Insert Additional Analyst Documents

Run these MongoDB commands to create 8 more analyst documents in your `analysts` collection:

## Insert Analyst ID 0:
```javascript
db.analysts.insertOne({
  "analystId": 0,
  "name": "Analyst 0",
  "calendly": {
    "enabled": false,
    "userUri": null,
    "accessToken": null
  }
})
```

## Insert Analyst ID 2:
```javascript
db.analysts.insertOne({
  "analystId": 2,
  "name": "Analyst 2",
  "calendly": {
    "enabled": false,
    "userUri": null,
    "accessToken": null
  }
})
```

## Insert Analyst ID 3:
```javascript
db.analysts.insertOne({
  "analystId": 3,
  "name": "Analyst 3",
  "calendly": {
    "enabled": false,
    "userUri": null,
    "accessToken": null
  }
})
```

## Insert Analyst ID 4:
```javascript
db.analysts.insertOne({
  "analystId": 4,
  "name": "Analyst 4",
  "calendly": {
    "enabled": false,
    "userUri": null,
    "accessToken": null
  }
})
```

## Insert Analyst ID 5:
```javascript
db.analysts.insertOne({
  "analystId": 5,
  "name": "Analyst 5",
  "calendly": {
    "enabled": false,
    "userUri": null,
    "accessToken": null
  }
})
```

## Insert Analyst ID 6:
```javascript
db.analysts.insertOne({
  "analystId": 6,
  "name": "Analyst 6",
  "calendly": {
    "enabled": false,
    "userUri": null,
    "accessToken": null
  }
})
```

## Insert Analyst ID 7:
```javascript
db.analysts.insertOne({
  "analystId": 7,
  "name": "Analyst 7",
  "calendly": {
    "enabled": false,
    "userUri": null,
    "accessToken": null
  }
})
```

## Alternative: Insert All at Once
```javascript
db.analysts.insertMany([
  {
    "analystId": 0,
    "name": "Analyst 0",
    "calendly": {
      "enabled": false,
      "userUri": null,
      "accessToken": null
    }
  },
  {
    "analystId": 2,
    "name": "Analyst 2",
    "calendly": {
      "enabled": false,
      "userUri": null,
      "accessToken": null
    }
  },
  {
    "analystId": 3,
    "name": "Analyst 3",
    "calendly": {
      "enabled": false,
      "userUri": null,
      "accessToken": null
    }
  },
  {
    "analystId": 4,
    "name": "Analyst 4",
    "calendly": {
      "enabled": false,
      "userUri": null,
      "accessToken": null
    }
  },
  {
    "analystId": 5,
    "name": "Analyst 5",
    "calendly": {
      "enabled": false,
      "userUri": null,
      "accessToken": null
    }
  },
  {
    "analystId": 6,
    "name": "Analyst 6",
    "calendly": {
      "enabled": false,
      "userUri": null,
      "accessToken": null
    }
  },
  {
    "analystId": 7,
    "name": "Analyst 7",
    "calendly": {
      "enabled": false,
      "userUri": null,
      "accessToken": null
    }
  }
])
```

## After Inserting:

1. **Update names** - Change "Analyst X" to actual analyst names
2. **Enable Calendly** - Set `"enabled": true` for analysts with Calendly
3. **Add credentials** - Add `userUri` and `accessToken` for enabled analysts

## Example Update for an Analyst with Calendly:
```javascript
db.analysts.updateOne(
  { "analystId": 2 },
  {
    $set: {
      "name": "John Doe",
      "calendly.enabled": true,
      "calendly.userUri": "https://api.calendly.com/users/analyst-2-uri",
      "calendly.accessToken": "analyst-2-access-token"
    }
  }
)
```
