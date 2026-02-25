# YouTube Video Integration Testing Guide

## Prerequisites

1. **Admin Account**: You need admin access to `/admin/bootcamp`
2. **Test User Account**: A user account enrolled in a bootcamp
3. **YouTube Video**: An unlisted YouTube video (or use a public test video for testing)

## Step-by-Step Testing

### Phase 1: Admin Setup (5-10 minutes)

#### 1.1 Create/Edit Bootcamp
1. Navigate to `/admin/bootcamp`
2. Click "Edit" on an existing bootcamp (or create a new one)
3. Scroll down to "Lessons/Videos Management" section
4. You should see:
   - "Add New Lesson" form
   - List of existing lessons (if any)

#### 1.2 Add a Test Lesson
1. In "Add New Lesson" form:
   - **Title**: `Test Lesson 1`
   - **YouTube Video ID or URL**: Use one of these:
     - Direct ID: `dQw4w9WgXcQ` (Rick Roll - safe for testing)
     - Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
     - Short URL: `https://youtu.be/dQw4w9WgXcQ`
   - **Description** (optional): `This is a test lesson`
2. Click "Add Lesson"
3. **Expected**: Lesson appears in "Existing Lessons" list below

#### 1.3 Add Multiple Lessons
1. Add 2-3 more lessons with different titles
2. **Expected**: Lessons appear in order, numbered #1, #2, #3, etc.

#### 1.4 Test Edit Functionality
1. Click "Edit" on a lesson
2. Modify the title or video ID
3. Click "Save"
4. **Expected**: Changes are saved and reflected in the list

#### 1.5 Test Delete Functionality
1. Click "Delete" on a lesson
2. Confirm deletion
3. **Expected**: Lesson is removed from the list

### Phase 2: User Experience Testing (10-15 minutes)

#### 2.1 Access Progress Page
1. Log in as an enrolled user
2. Navigate to `/bootcamp/[bootcamp-id]/progress`
   - Replace `[bootcamp-id]` with the actual bootcamp ID
3. **Expected**: 
   - Page loads without errors
   - Lesson cards are displayed
   - Each card shows:
     - Thumbnail image
     - Lesson title
     - Progress percentage
     - "Continue Learning" or "Watch Again" button

#### 2.2 Open Video Player
1. Click "Continue Learning" on any lesson card
2. **Expected**:
   - Modal opens with dark overlay
   - Video player loads in the center
   - Lesson title is displayed at the top
   - Close button (X) is visible in top-right

#### 2.3 Test Video Playback
1. Click play button on the video
2. **Expected**:
   - Video starts playing
   - Controls are functional (pause, volume, fullscreen)
   - No related videos appear at the end (if `rel=0` is working)

#### 2.4 Test Progress Tracking
1. Watch video for 10-15 seconds
2. Pause the video
3. **Expected**:
   - Progress bar at top of modal shows percentage
   - Check browser console (F12) - should see API calls to save progress
4. Close the modal
5. **Expected**:
   - Lesson card shows updated progress percentage
   - Progress circle indicator is updated

#### 2.5 Test Completion
1. Watch a video to at least 90% completion
2. **Expected**:
   - Video auto-marks as completed
   - "Mark as Complete" button may appear
   - Lesson card shows "Completed" status
3. Click "Watch Again" on completed lesson
4. **Expected**: Video opens and can be replayed

#### 2.6 Test Navigation
1. Open a lesson video
2. If multiple lessons exist, test:
   - "Previous Lesson" button (if not first lesson)
   - "Next Lesson" button (if not last lesson)
3. **Expected**: 
   - Clicking navigates to the next/previous lesson
   - Video changes without closing modal

#### 2.7 Test Keyboard Shortcuts
1. With video modal open:
   - Press `Esc` key
   - **Expected**: Modal closes
2. With video playing:
   - Press `Space` (when video is focused)
   - **Expected**: Video pauses/plays

### Phase 3: Security Testing (5 minutes)

#### 3.1 Test Non-Enrolled User
1. Log out or use a different account
2. Try to access `/bootcamp/[id]/progress`
3. **Expected**: 
   - Shows "Not Enrolled" message
   - "Register Now" button is displayed
   - Cannot access videos

#### 3.2 Test Unauthenticated User
1. Log out completely
2. Try to access `/bootcamp/[id]/progress`
3. **Expected**: 
   - Redirects to sign-in page
   - Or shows "Sign In Required" message

#### 3.3 Test Direct API Access
1. Open browser console (F12)
2. Try to fetch progress directly:
   ```javascript
   fetch('/api/bootcamp/[id]/progress', { credentials: 'include' })
     .then(r => r.json())
     .then(console.log)
   ```
3. **Expected**: 
   - If not enrolled: Returns 403 error
   - If enrolled: Returns progress data

### Phase 4: Edge Cases (5 minutes)

#### 4.1 Invalid Video ID
1. In admin panel, try to add a lesson with invalid video ID: `invalid123`
2. **Expected**: Error message about invalid YouTube video ID

#### 4.2 Private/Deleted Video
1. Add a lesson with a private or deleted video ID
2. Try to play it
3. **Expected**: Error message in video player: "Failed to load video"

#### 4.3 Empty Bootcamp
1. Create a bootcamp with no lessons
2. Access progress page
3. **Expected**: Shows "No lessons available yet" message

#### 4.4 Mobile Testing
1. Open progress page on mobile device or resize browser
2. **Expected**:
   - Layout is responsive
   - Video player scales correctly
   - Touch controls work

## Quick Test Checklist

### Admin Functions
- [ ] Can add lesson with YouTube video ID
- [ ] Can add lesson with YouTube URL
- [ ] Can edit existing lesson
- [ ] Can delete lesson
- [ ] Lessons appear in correct order
- [ ] Invalid video ID shows error

### User Functions
- [ ] Can view progress page when enrolled
- [ ] Can open video modal
- [ ] Video plays correctly
- [ ] Progress updates while watching
- [ ] Progress saves on pause/close
- [ ] Lesson marks as completed at 90%+
- [ ] Can navigate between lessons
- [ ] Keyboard shortcuts work (Esc, Space)

### Security
- [ ] Non-enrolled users cannot access videos
- [ ] Unauthenticated users are redirected
- [ ] API returns 403 for unauthorized access

### Edge Cases
- [ ] Invalid video ID handled gracefully
- [ ] Private/deleted videos show error
- [ ] Empty bootcamp shows appropriate message
- [ ] Mobile responsive design works

## Common Issues & Solutions

### Issue: Video doesn't load
**Solution**: 
- Check YouTube video ID is correct
- Verify video is not private/deleted
- Check browser console for errors
- Ensure YouTube iframe API is loading

### Issue: Progress not saving
**Solution**:
- Check browser console for API errors
- Verify user is enrolled
- Check network tab for failed requests
- Ensure authentication cookies are set

### Issue: Modal doesn't open
**Solution**:
- Check browser console for JavaScript errors
- Verify `VideoPlayerModal` component is imported
- Check that lesson data includes `youtubeVideoId`

### Issue: Admin can't add lessons
**Solution**:
- Verify admin authentication (check cookies)
- Check API endpoint is accessible
- Verify bootcamp ID is correct
- Check browser console for errors

## Testing with Real Data

For production-like testing:

1. **Upload unlisted video to YouTube**:
   - Go to YouTube Studio
   - Upload a test video
   - Set visibility to "Unlisted"
   - Copy the video ID

2. **Create test bootcamp**:
   - Use admin panel to create bootcamp
   - Add multiple lessons with real video IDs
   - Set up proper enrollment flow

3. **Test full flow**:
   - Register for bootcamp
   - Complete payment (if required)
   - Access progress page
   - Watch videos and verify progress tracking

## Performance Testing

1. **Load Time**: Progress page should load in < 2 seconds
2. **Video Load**: Video should start loading within 1 second of modal open
3. **Progress Save**: Progress should save without noticeable delay
4. **Multiple Lessons**: Page should handle 10+ lessons without lag

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps After Testing

If all tests pass:
1. Add real bootcamp content
2. Upload unlisted videos to YouTube
3. Configure lessons in admin panel
4. Announce to enrolled users

If issues are found:
1. Check browser console for errors
2. Check server logs for API errors
3. Verify database collections exist
4. Test API endpoints directly using Postman/curl

