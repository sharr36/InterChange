# InterChange - AI-Powered Parts Cross-Reference System

InterChange is a comprehensive web application for automotive, equipment, and industrial parts cross-referencing powered by artificial intelligence.

## Features

### Core Functionality
- **AI-Powered Part Identification**: Upload images of parts to automatically identify and extract specifications
- **Intelligent Cross-Referencing**: Find equivalent and compatible parts across different manufacturers
- **Semantic Search**: Natural language search for parts using AI
- **Compatibility Checking**: Verify part compatibility with AI analysis

### Data Management
- **CSV Import**: Bulk upload parts data via CSV files
- **Web Scraping**: Extract part information from manufacturer websites
- **Manual Entry**: Add parts individually with detailed specifications
- **Parts Approval System**: Admin moderation for quality control

### Community Features
- **Discussion Forum**: Community-driven discussions about parts
- **User Accounts**: Role-based access (User, Moderator, Admin)
- **Comments & Threads**: Nested discussions on parts and topics

### Part Categories
- Filters (oil, air, hydraulic, fuel)
- Bearings
- Spark Plugs
- Belts
- Industrial Parts
- Equipment Parts
- And more...

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom auth system with bcrypt
- **AI**: Anthropic Claude API for vision and NLP
- **Web Scraping**: Cheerio + Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/InterChange.git
cd InterChange
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/interchange"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Anthropic API for AI features
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Application
NODE_ENV="development"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main models:

- **User**: User accounts with role-based access
- **Part**: Parts with specifications and metadata
- **Category/SubCategory**: Part categorization
- **CrossReference**: Part equivalency mappings
- **Compatibility**: Part compatibility relationships
- **ForumCategory/Post/Comment**: Discussion forum
- **ImportJob**: Track CSV import operations

## Usage

### Adding Parts

**Via CSV Import:**
1. Navigate to `/parts/import`
2. Download the CSV template
3. Fill in part data (partNumber, manufacturer, description, category, specs)
4. Upload and import

**Via Image:**
1. Navigate to `/parts/identify`
2. Upload a part image
3. AI will analyze and extract part information
4. Review and save

**Via Web Scraping:**
Use the scraper API to extract part data from URLs

### Searching for Parts

1. Navigate to `/parts/search`
2. Choose search type:
   - **Part Number**: Exact part number search
   - **Description**: Text-based search
   - **Manufacturer**: Search by manufacturer
   - **AI Search**: Natural language queries

Example AI searches:
- "10 micron hydraulic filter"
- "oil filter for 2015 Honda Civic"
- "spark plug equivalent to NGK BKR6E"

### Finding Cross-References

1. View any part details page
2. Click "Find Cross-References"
3. AI will analyze and suggest compatible/equivalent parts
4. Review confidence scores and compatibility types

### Admin Panel

Administrators can access `/admin` to:
- Approve/reject pending parts
- Manage users
- Moderate forum content
- View import jobs

## API Endpoints

### Parts
- `GET /api/parts/search` - Search parts
- `POST /api/parts/import` - Import CSV
- `POST /api/parts/identify` - Identify from image
- `GET /api/parts/cross-reference` - Find cross-references

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in

## Development

### Project Structure

```
InterChange/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── forum/             # Forum pages
│   ├── parts/             # Parts pages
│   └── page.tsx           # Homepage
├── lib/                    # Utility libraries
│   ├── ai.ts              # AI helper functions
│   ├── prisma.ts          # Prisma client
│   └── scraper.ts         # Web scraping utilities
├── prisma/                 # Database schema
│   └── schema.prisma
└── middleware.ts          # Next.js middleware
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Roadmap

- [ ] API integrations with major parts suppliers
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Price comparison features
- [ ] Inventory management
- [ ] Multi-language support
- [ ] Real-time chat
- [ ] Parts marketplace

## Acknowledgments

- Built with Next.js and React
- AI powered by Anthropic Claude
- Database management with Prisma

---

Made with ❤️ for the automotive and industrial parts community
