# 📊 Tally | Daily financial tracking App

**Tally** is a professional, mobile-first web application designed for precise purchase logging. It allows users to track shopping sessions by calculating net prices, quantities, and specific discounts with surgical accuracy. Built with a **Master-Detail** architecture, it provides a clean, fast, and distraction-free user experience.

---

## ✨ Key Features

* **Master-Detail Record:** Group multiple products into a single "Purchase Session" categorized by date and description.
* **Dynamic Calculation:** Real-time calculation of item subtotals (net - discount) and the overall purchase grand total.
* **Mobile-First Design:** A minimalist interface optimized for one-handed use, featuring a professional **Midnight Blue** and **Emerald Green** palette.
* **Audit History:** A dedicated dashboard to review and audit previous shopping trips and itemized details.
* **Serverless Persistence:** Direct integration with Supabase for secure, real-time data management without a dedicated Express backend.

---

## 🛠️ Tech Stack

* **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) (JSX)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **State Management:** React Hooks (`useState`, `useEffect`)

---

## 🗄️ Database Schema

The project utilizes two main PostgreSQL tables to maintain relational integrity:

### `purchase_master`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `created_at` | timestamptz | Recoord creation |
| `purchase_date` | Date | Date of the transaction |
| `description` | Text | Name or category of the purchase |
| `total_amount` | Numeric | Final sum of the entire session |
| `user_id` | UUID | User property record |

### `purchase_items`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `master_id` | UUID | Foreign Key (purchase_master) |
| `product_name` | Text | Name of the specific item |
| `net_price` | Numeric | Unit base price |
| `quantity` | Integer | Units purchased |
| `discount_perc` | Numeric | Applied discount % |
| `subtotal` | Numeric | Calculated item total |
