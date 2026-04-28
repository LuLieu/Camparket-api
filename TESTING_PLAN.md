# Camparket API Testing Plan

Use Swagger UI at `/api-docs`. Seeded credentials:

- Admin: `admin@charlotte.edu` / `Password123!`
- Seller student: `lrettke@charlotte.edu` / `Password123!`
- Buyer student: `buyer@charlotte.edu` / `Password123!`

For protected endpoints, call `POST /api/auth/login`, copy the returned token, click **Authorize** in Swagger UI, and paste `Bearer <token>`.

## Authentication

### POST `/api/auth/signup`
- Access control: Public.
- Success: submit `{"username":"newstudent","email":"newstudent@charlotte.edu","password":"Password123!"}`. Expect `201 Created`.
- 400 Bad Request: omit `password`.
- 403 Forbidden: use an email that does not end in `@charlotte.edu`.
- 409 Conflict: reuse `lrettke@charlotte.edu` or username `lulu`.

### POST `/api/auth/login`
- Access control: Public.
- Success: login with any seeded credential. Expect `200 OK` and a JWT token.
- 400 Bad Request: omit `email`.
- 401 Unauthorized: use the wrong password.

## Listings

### GET `/api/listings`
- Access control: Public.
- Success: click **Try it out** with no query. Expect `200 OK` and seeded listings.
- 400 Bad Request: use `status=badstatus`.

### GET `/api/listings/{id}`
- Access control: Public.
- Success: use `101`. Expect listing details.
- 400 Bad Request: use `-1`.
- 404 Not Found: use `9999`.

### POST `/api/listings`
- Access control: Authenticated student/admin.
- Setup: authorize as `buyer@charlotte.edu`.
- Success: create with category `1`, title, description, price, and condition `good`. Expect `201 Created`.
- 400 Bad Request: remove `title`.
- 401 Unauthorized: clear Swagger authorization and retry.
- 404 Not Found: use `category_id: 9999`.

### PUT `/api/listings/{id}`
- Access control: Owner of listing or admin.
- Setup: authorize as `lrettke@charlotte.edu`.
- Success: update listing `101` price or title. Expect `200 OK`.
- 400 Bad Request: set `price` to `-5`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as `buyer@charlotte.edu` and update `101`.
- 404 Not Found: use `9999`.

### DELETE `/api/listings/{id}`
- Access control: Owner of listing or admin.
- Success: create a listing as buyer, then delete that new listing. Expect `200 OK`.
- 400 Bad Request: use `abc`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as buyer and delete seeded listing `101`.
- 404 Not Found: use `9999`.

## Messages

### GET `/api/messages`
- Access control: Authenticated user.
- Success: authorize as `buyer@charlotte.edu`. Expect messages involving that user.
- 401 Unauthorized: clear authorization.

### POST `/api/messages`
- Access control: Authenticated user.
- Success: authorize as buyer and send `{"listing_id":101,"content":"Is this still available?"}`. Expect `201 Created`.
- 400 Bad Request: omit `content`.
- 401 Unauthorized: clear authorization.
- 404 Not Found: use `listing_id: 9999`.

### GET `/api/messages/{id}`
- Access control: Sender, receiver, or admin.
- Success: authorize as buyer and get `300`. Expect `200 OK`.
- 400 Bad Request: use `bad`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: create a third student account, authorize as that user, and get `300`.
- 404 Not Found: use `9999`.

### PUT `/api/messages/{id}`
- Access control: Participant; only sender/admin can edit content.
- Success: authorize as buyer and update `300` content or `is_read`. Expect `200 OK`.
- 400 Bad Request: send an empty JSON body.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as seller and try changing `content`.
- 404 Not Found: use `9999`.

### DELETE `/api/messages/{id}`
- Access control: Sender, receiver, or admin.
- Success: create a new message and delete it. Expect `200 OK`.
- 400 Bad Request: use `-1`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as an unrelated user.
- 404 Not Found: use `9999`.

## Meetups

### GET `/api/meetups`
- Access control: Authenticated user.
- Success: authorize as buyer or seller. Expect seeded meetup `400`.
- 401 Unauthorized: clear authorization.

### POST `/api/meetups`
- Access control: Authenticated buyer for another user's listing.
- Success: authorize as buyer and submit listing `101`, location, and scheduled time. Expect `201 Created`.
- 400 Bad Request: omit `scheduled_time`.
- 401 Unauthorized: clear authorization.
- 404 Not Found: use `listing_id: 9999`.

### GET `/api/meetups/{id}`
- Access control: Buyer, seller, or admin.
- Success: authorize as buyer and get `400`. Expect `200 OK`.
- 400 Bad Request: use `bad`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as unrelated user.
- 404 Not Found: use `9999`.

### PUT `/api/meetups/{id}`
- Access control: Buyer, seller, or admin.
- Success: authorize as seller and update status to `accepted`. Expect `200 OK`.
- 400 Bad Request: set status to `invalid`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as unrelated user.
- 404 Not Found: use `9999`.

### DELETE `/api/meetups/{id}`
- Access control: Buyer, seller, or admin.
- Success: create a new meetup and delete it. Expect `200 OK`.
- 400 Bad Request: use `-1`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as unrelated user.
- 404 Not Found: use `9999`.

## Categories

### GET `/api/categories`
- Access control: Public.
- Success: no query parameters. Expect category list.
- 400 Bad Request: provide an unexpected query parameter.

### GET `/api/categories/{id}`
- Access control: Public.
- Success: use `2`. Expect Electronics.
- 400 Bad Request: use `bad`.
- 404 Not Found: use `9999`.

### POST `/api/categories`
- Access control: Admin.
- Setup: authorize as `admin@charlotte.edu`.
- Success: create a unique category. Expect `201 Created`.
- 400 Bad Request: omit `name`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as a student.
- 409 Conflict: reuse `Misc`.

### PUT `/api/categories/{id}`
- Access control: Admin.
- Success: authorize as admin and update a category. Expect `200 OK`.
- 400 Bad Request: empty `name`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as a student.
- 404 Not Found: use `9999`.

### DELETE `/api/categories/{id}`
- Access control: Admin.
- Success: create a category, then delete it. Expect `200 OK`.
- 400 Bad Request: use `bad`.
- 401 Unauthorized: clear authorization.
- 403 Forbidden: authorize as a student.
- 404 Not Found: use `9999`.
