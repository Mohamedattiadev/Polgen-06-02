Features for Users
Login & Logout:

Users can securely log in using their credentials.
Users can log out when done.
Place an Order:

Users can fill out a form to create an order for medical items.
Order form fields could include:
Product Name
Quantity
Special Instructions (if any)
View Order History:
Users can view a table showing all their previous orders, including:
Order ID
Product Name
Quantity
Order Status (e.g., Pending, Approved, Rejected, In Progress, Completed)
Track Order Progress:

Users can see the current status of their orders in real-time (e.g., Pending, In Progress, Completed).
Optionally, provide detailed tracking (e.g., "In production," "Shipped," etc.).
Send Feedback:

Users can provide feedback for completed orders or overall platform experience.
Fields for feedback:
Feedback Title
Description
Ratings (optional)
Send Messages:

Users can send inquiries or messages to the admin for support.
Messages can include:
Subject
Message Body
Features for Admins
View and Manage Orders:

Admins can view all user orders in a Material-UI table with columns like:
User Name
Order ID
Product Name
Category
Quantity
Status
Actions (e.g., Approve, Reject, Modify)
Categorize Orders:

Orders can be categorized based on product type:
Prob Category
Prime Category
Approve or Reject Orders:

Admins can review user orders and either:
Approve the order (status changes to "Approved").
Reject the order (status changes to "Rejected").
Modify Orders:

Admins can update order details if necessary, such as:
Product name
Quantity
Category
Any changes made should be logged and visible to the user in the history.
Filter and Search Orders:

Admins can filter orders by:
Category (e.g., Prob or Prime)
Status (e.g., Pending, Approved, Completed)
User
Admins can search for specific orders by Order ID or User Name.
View Done vs. Pending Orders:

Separate dashboards or tabs for:
Orders that are completed.
Orders that are still pending or in progress.
Additional Functionalities
Notifications:

Notify users about order status changes (e.g., via email or on the website).
Role-Based Access:

Different dashboards for users and admins.
Users only access their orders.
Admins manage all orders.
Analytics for Admins (Optional):

Admins can view analytics such as:
Total orders
Completed vs. pending orders
Top products ordered
Database Design
Here’s a high-level view of the database tables you might need:

1. Users Table:
id: Unique identifier
username: Name of the user
email: Email of the user
password: Encrypted password
role: User or Admin
phone: Contact number (optional)
address: Address of the user
2. Orders Table:
id: Unique order identifier
user_id: Foreign key linking to the Users table
product_name: Name of the product
quantity: Number of items ordered
category: Prob or Prime
status: Pending, Approved, Rejected, Completed
created_at: Timestamp of the order creation
updated_at: Timestamp of the last status change
3. Feedback Table:
id: Unique identifier
user_id: Foreign key linking to the Users table
order_id: Foreign key linking to the Orders table (optional)
title: Feedback title
description: Feedback description
rating: Rating provided by the user (optional)
created_at: Timestamp of when the feedback was submitted
4. Messages Table:
id: Unique identifier
user_id: Foreign key linking to the Users table
subject: Subject of the message
message_body: Content of the message
created_at: Timestamp of when the message was sent
Frontend Structure
This should remain as per the tree structure you shared, with the following updates:

Pages/Order/User/UserDashboard.jsx:

Add features for placing orders, tracking orders, and viewing order history.
Pages/Order/Admin/AdminDashboard.jsx:

Add features for managing orders, approving/rejecting them, and categorizing them.
Components/Shared/Tables:

Create reusable Material-UI tables for both users and admins.
Backend Structure
Add the following endpoints:

Order Routes:

POST /api/orders: To create a new order.
GET /api/orders: To fetch all orders (admin-only).
GET /api/orders/:userId: To fetch orders for a specific user.
PATCH /api/orders/:orderId: To update an order (admin-only).
DELETE /api/orders/:orderId: To delete an order (optional).
Feedback Routes:

POST /api/feedback: To submit feedback.
GET /api/feedback/:userId: To fetch user-specific feedback (optional).
Messages Routes:

POST /api/messages: To send a message.
GET /api/messages: To fetch messages (admin-only).

