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

/* -------------------- FEATURED (front and center) -------------------- */
/* Each tile either plays a "video" in the lightbox, or links via "href".
   "wide" makes a tile span two columns. Edit freely. */
var CLUB_FEATURED = [
  {
    kicker:  "The Film",
    title:   "Montana Institute of Sport",
    desc:    "Who we are, and the work behind The 26 Club.",
    poster:  "https://img.youtube.com/vi/mIXb6OomPBo/maxresdefault.jpg",
    video:   "https://www.youtube.com/watch?v=mIXb6OomPBo",
    primary: true
  },
  {
    kicker: "Film",
    title:  "The New Field",
    desc:   "A first look at our new turf.",
    poster: "images/featured/new-field.jpg",
    video:  "media/mis-new-field.mp4"        // self-hosted file
  },
  {
    kicker: "Recap",
    title:  "Great Northwest Challenge",
    desc:   "2026 tournament recap.",
    poster: "images/featured/gnc.jpg",
    video:  "https://www.youtube.com/watch?v=gUOQj7AJZYA"   // YouTube — plays in the lightbox
  },
  {
    kicker: "Trip Recap",
    title:  "Chicago Weekend",
    desc:   "Ireland vs New Zealand, on the road.",
    poster: "images/gallery/chicago/img_5674.jpg",   // local fallback (YouTube thumb still processing)
    video:  "https://www.youtube.com/watch?v=we0WXbpOuCU"
  },
];

/* -------------------- FILMS (the Films tab — everything else) -------------------- */
var CLUB_FILMS = [
  {
    kicker: "Film",
    title:  "GNC Fly By",
    desc:   "A flight over the tournament.",
    poster: "https://img.youtube.com/vi/J6nZikzYOsY/maxresdefault.jpg",
    video:  "https://www.youtube.com/watch?v=J6nZikzYOsY"
  },
  {
    kicker: "Members' Night",
    title:  "Wine Dinner",
    desc:   "An evening with the club.",
    poster: "https://img.youtube.com/vi/7tqhkdoTkx8/maxresdefault.jpg",
    video:  "https://www.youtube.com/watch?v=7tqhkdoTkx8"
  },
];

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
    tag:   "From the Club",
    title: "Welcome home, brothers",
    body:  "This is the private home of The 26 Club — your dispatches, the calendar of trips and events, the brotherhood in pictures, and the impact your seat makes possible. Bookmark it, and check back often.",
    image: "",
    link:  ""
  },
];

/* -------------------- WHAT YOU GET (membership benefits) -------------------- */
var CLUB_BENEFITS = [
  {
    icon:  "✦",
    title: "Extraordinary Trips",
    desc:  "The club travels together to the world's great sporting occasions. Recent journeys: USA vs Canada rugby in Los Angeles and a weekend in Edinburgh with Scottish international players."
  },
  {
    icon:  "✦",
    title: "Access You Can't Buy",
    desc:  "Behind-the-ropes moments with athletes and coaches — including time on the road with the USA Rugby National Team Head Coach. The kind of access reserved for the few."
  },
  {
    icon:  "✦",
    title: "A True Brotherhood",
    desc:  "Twenty-six men who show up for one another. Dinners, match days, and gatherings through the year — a circle of trust that lasts well beyond any single season."
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

/* -------------------- TRIP GALLERIES (photos + clips per trip) -------------------- */
var CLUB_GALLERIES = [
  {
    title: "Chicago Weekend",
    caption: "Ireland vs New Zealand — a weekend on the road.",
    items: [
    { type: "photo", src: "images/gallery/chicago/img_5660.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5661.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5662.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5664.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5674.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5675.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5675b.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5676.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5677.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5694.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5696.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5701.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5702.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5703.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5704.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5709.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5710.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5741.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5742.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5758.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5759.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5766.jpg" },
    { type: "photo", src: "images/gallery/chicago/img_5778.jpg" }
    ]
  },
  {
    title: "Baltimore",
    caption: "Rugby's Greatest Rivalry — Springboks vs All Blacks at M&T Bank Stadium.",
    items: [
    { type: "photo", src: "images/gallery/baltimore/img_1938.jpg" },
    { type: "photo", src: "images/gallery/baltimore/img_1956.jpg" },
    { type: "photo", src: "images/gallery/baltimore/img_1982.jpg" },
    { type: "video", src: "media/baltimore/img_2006.mp4", poster: "images/gallery/baltimore/posters/img_2006.jpg" },
    { type: "photo", src: "images/gallery/baltimore/img_2010.jpg" },
    { type: "photo", src: "images/gallery/baltimore/img_2015.jpg" }
    ]
  },
  {
    title: "Los Angeles",
    caption: "USA vs Canada — a weekend in LA with the club.",
    items: [
    { type: "photo", src: "images/gallery/la/img_9539.jpg" },
    { type: "photo", src: "images/gallery/la/img_9545.jpg" },
    { type: "photo", src: "images/gallery/la/img_9546.jpg" },
    { type: "photo", src: "images/gallery/la/img_9547.jpg" },
    { type: "video", src: "media/la/img_9548.mp4", poster: "images/gallery/la/posters/img_9548.jpg" },
    { type: "photo", src: "images/gallery/la/img_9549.jpg" },
    { type: "photo", src: "images/gallery/la/img_9551.jpg" },
    { type: "video", src: "media/la/img_9552.mp4", poster: "images/gallery/la/posters/img_9552.jpg" },
    { type: "video", src: "media/la/img_9553.mp4", poster: "images/gallery/la/posters/img_9553.jpg" },
    { type: "photo", src: "images/gallery/la/img_9554.jpg" },
    { type: "photo", src: "images/gallery/la/img_9555.jpg" },
    { type: "video", src: "media/la/img_9558.mp4", poster: "images/gallery/la/posters/img_9558.jpg" },
    { type: "photo", src: "images/gallery/la/img_9561.jpg" },
    { type: "video", src: "media/la/img_9562.mp4", poster: "images/gallery/la/posters/img_9562.jpg" },
    { type: "photo", src: "images/gallery/la/img_9565.jpg" },
    { type: "video", src: "media/la/img_9566.mp4", poster: "images/gallery/la/posters/img_9566.jpg" },
    { type: "video", src: "media/la/img_9568.mp4", poster: "images/gallery/la/posters/img_9568.jpg" },
    { type: "photo", src: "images/gallery/la/img_9574.jpg" },
    { type: "photo", src: "images/gallery/la/img_9577.jpg" },
    { type: "photo", src: "images/gallery/la/img_9579.jpg" },
    { type: "photo", src: "images/gallery/la/img_9580.jpg" },
    { type: "photo", src: "images/gallery/la/img_9581.jpg" },
    { type: "photo", src: "images/gallery/la/img_9582.jpg" },
    { type: "photo", src: "images/gallery/la/img_9583.jpg" },
    { type: "photo", src: "images/gallery/la/img_9584.jpg" },
    { type: "photo", src: "images/gallery/la/img_9586.jpg" },
    { type: "video", src: "media/la/img_9587.mp4", poster: "images/gallery/la/posters/img_9587.jpg" },
    { type: "photo", src: "images/gallery/la/img_9588.jpg" },
    { type: "photo", src: "images/gallery/la/img_9588b.jpg" }
    ]
  }
];
