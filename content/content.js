/* ==========================================================================
   THE 26 CLUB — SITE CONTENT
   --------------------------------------------------------------------------
   This is the only file you need to edit to update the site. No coding needed
   — copy an existing block, change the text between the quotes, and keep the
   punctuation (quotes, commas, braces). Save, then refresh the page.

   ADD A NEWSLETTER UPDATE: copy one { ... } block in CLUB_POSTS and paste it
   at the TOP of the list (newest first).

   ADD A VIDEO: copy one { ... } block in CLUB_VIDEOS and paste your YouTube or
   Vimeo link into "url". The thumbnail is pulled in automatically.

   The four impact numbers at the top of the page live in CLUB_IMPACT.
   ========================================================================== */

/* -------------------- IMPACT NUMBERS (top of page) -------------------- */
var CLUB_IMPACT = [
  { num: "100+",   label: "Schools Reached",  sub: "Montana public schools supported to date" },
  { num: "50,000", label: "Students",         sub: "Young Montanans touched by our programs" },
  { num: "26",     label: "Founding Members", sub: "The 26 Club — partners powering the mission" },
  { num: "2022",   label: "Established",       sub: "Founded in Bozeman, Montana" },
];

/* -------------------- NEWSLETTER UPDATES (newest first) -------------------- */
var CLUB_POSTS = [
  {
    date:  "September 2026",
    tag:   "Program Update",
    title: "TRY Rugby lands in three new Bozeman schools",
    body:  "This month we brought the TRY Rugby curriculum to three more elementary schools, reaching over 400 new students. Teachers reported record engagement, and we've already had requests to come back next term.",
    image: "images/team-huddle.jpg",   // a photo path, or "" for a placeholder
    link:  ""                            // a "read more" link, or "" for none
  },
  {
    date:  "August 2026",
    tag:   "Behind the Scenes",
    title: "A look back at the summer TRY Sport camps",
    body:  "From flag rugby to track days, our summer camps kept hundreds of Montana kids moving all season. Here's a recap of the highlights, the numbers, and a few of our favorite moments from the field.",
    image: "images/coach-with-athlete.jpg",
    link:  ""
  },
  {
    date:  "July 2026",
    tag:   "Club News",
    title: "Welcome to the 26 Club members' hub",
    body:  "This is your private home for everything the Montana Institute of Sport is up to — impact updates, videos from the field, and a running newsletter of our progress. Bookmark it and check back often.",
    image: "",
    link:  ""
  },
];

/* -------------------- WHAT YOU GET (membership benefits) -------------------- */
var CLUB_BENEFITS = [
  {
    icon:  "✈️",   // plane
    title: "Exclusive Trips",
    desc:  "Invitations to high-level professional sporting events around the world — recent trips have included USA vs Canada rugby in Los Angeles and a visit to Edinburgh with Scottish international players."
  },
  {
    icon:  "⭐",          // star
    title: "Once-in-a-lifetime Experiences",
    desc:  "Access to athletes, coaches, and behind-the-scenes moments you can't buy — including time with the USA Rugby National Team Head Coach on the road."
  },
  {
    icon:  "🤝",   // handshake
    title: "Members' Events & Community",
    desc:  "A like-minded community of 26, brought together by a shared belief in getting Montana kids moving. Gatherings, dinners, and match days throughout the year."
  },
];

/* -------------------- TRIPS & EVENTS (newest/upcoming first) -------------------- */
/* "status" can be "Upcoming" or "Past" — it controls the little tag colour. */
var CLUB_EVENTS = [
  {
    date:   "November 2026",
    status: "Upcoming",
    title:  "Ireland vs New Zealand",
    place:  "Chicago, IL — first weekend of November"
  },
  {
    date:   "2025",
    status: "Past",
    title:  "Edinburgh with Scottish Internationals",
    place:  "Edinburgh, Scotland"
  },
  {
    date:   "2025",
    status: "Past",
    title:  "USA vs Canada Rugby",
    place:  "Los Angeles, CA — with the USA Rugby National Team Head Coach"
  },
];

/* -------------------- VIDEOS -------------------- */
/* "url" accepts a normal YouTube or Vimeo link. Optional "poster" overrides
   the auto thumbnail with your own image file. */
var CLUB_VIDEOS = [
  {
    title:  "MIS: The New Field",
    desc:   "A look at the Montana Institute of Sport's newest field.",
    file:   "media/mis-new-field.mp4",   // self-hosted video (in the media/ folder)
    poster: ""                            // optional: a still image path for the thumbnail
  },
  {
    title:  "Great Northwest Challenge 2026 Reel",
    desc:   "Highlights from the 2026 Great Northwest Challenge.",
    file:   "media/gnc-2026-reel.mp4",
    poster: ""
  },
  {
    title: "TRY Rugby in the classroom",
    desc:  "Highlights from a TRY Rugby session at Anderson School.",
    url:   "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    poster: ""
  },
  {
    title: "Summer camp recap",
    desc:  "The best moments from our 2026 summer TRY Sport camps.",
    url:   "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    poster: ""
  },
  {
    title: "Meet the coaches",
    desc:  "The people bringing physical education back to Montana schools.",
    url:   "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    poster: ""
  },
];
