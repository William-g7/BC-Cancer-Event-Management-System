#!/bin/bash

# Create project structure script for Donor Engagement System
PROJECT_NAME="donor-engagement-system"

# Create root directory
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Frontend structure
mkdir -p frontend/src/{app,components,hooks,types,utils}

# Frontend app pages
mkdir -p frontend/src/app/{events,dashboard}
mkdir -p frontend/src/app/events/[eventId]/donor-selection

# Frontend components
mkdir -p frontend/src/components/{events,donors,layout,ui}

# Backend structure
mkdir -p backend/src/{controllers,models,routes,types}

# Create basic template files
# Frontend types
cat > frontend/src/types/event.ts << 'EOL'
export interface Event {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    estimateInvitation: number;
    fundraisers: string[];
    totalSelected: number;
}
EOL

cat > frontend/src/types/donor.ts << 'EOL'
export interface Donor {
    id: string;
    name: string;
    largestGiftAppeal: number;
    lastGiftDate: string;
    address: string;
    notes: DonorNote[];
    isSelected: boolean;
    selectedBy?: string;
}

export interface DonorNote {
    id: string;
    content: string;
    author: string;
    createdAt: string;
}
EOL

# Frontend pages
cat > frontend/src/app/page.tsx << 'EOL'
export default function HomePage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">BC Cancer Foundation</h1>
        </div>
    );
}
EOL

cat > frontend/src/app/dashboard/page.tsx << 'EOL'
export default function DashboardPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Fundraiser Dashboard</h1>
        </div>
    );
}
EOL

cat > frontend/src/app/events/page.tsx << 'EOL'
export default function EventsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Events</h1>
        </div>
    );
}
EOL

# Frontend components
cat > frontend/src/components/events/event-list.tsx << 'EOL'
import { type FC } from 'react';
import { Event } from '@/types/event';

interface EventListProps {
    events: Event[];
}

export const EventList: FC<EventListProps> = ({ events }) => {
    return (
        <div>
            {events.map(event => (
                <div key={event.id}>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                </div>
            ))}
        </div>
    );
};
EOL

cat > frontend/src/components/donors/donor-table.tsx << 'EOL'
import { type FC } from 'react';
import { Donor } from '@/types/donor';

interface DonorTableProps {
    donors: Donor[];
    onSelect: (donorId: string) => void;
}

export const DonorTable: FC<DonorTableProps> = ({ donors, onSelect }) => {
    return (
        <table className="w-full">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Largest Gift</th>
                    <th>Last Gift Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {donors.map(donor => (
                    <tr key={donor.id}>
                        <td>{donor.name}</td>
                        <td>{donor.largestGiftAppeal}</td>
                        <td>{donor.lastGiftDate}</td>
                        <td>
                            <button onClick={() => onSelect(donor.id)}>
                                Select
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
EOL

# Backend files
cat > backend/src/controllers/event.controller.ts << 'EOL'
import { Request, Response } from 'express';

export class EventController {
    async getEvents(req: Request, res: Response) {
        try {
            // Implement event fetching logic
            res.json({ message: 'Get events' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    }
}
EOL

cat > backend/src/routes/event.routes.ts << 'EOL'
import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();
const eventController = new EventController();

router.get('/events', eventController.getEvents);

export default router;
EOL

# Package.json files
cat > frontend/package.json << 'EOL'
{
  "name": "donor-engagement-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0"
  }
}
EOL

cat > backend/package.json << 'EOL'
{
  "name": "donor-engagement-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node-dev": "^2.0.0"
  }
}
EOL

# Create necessary config files
cat > frontend/tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOL

cat > backend/tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOL

# Make the script executable
chmod +x setup.sh

echo "Project structure created successfully!"
echo "To start development:"
echo "1. cd frontend && npm install"
echo "2. cd ../backend && npm install"
echo "3. Start frontend: npm run dev"
echo "4. Start backend: npm run dev"
EOL
