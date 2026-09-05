import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface Project {
    id: number;
    name: string;
    description: string;
    language: string;
    stars: number;
    bounty?: number;
}

const projects: Project[] = [
    {
        id: 1,
        name: 'awesome-library',
        description: 'An awesome open source library',
        language: 'TypeScript',
        stars: 1250,
        bounty: 500
    }
];

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Open Source Project Marketplace API', version: '1.0.0' });
});

app.get('/api/projects', (req: Request, res: Response) => {
    res.json(projects);
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
});

app.post('/api/projects', (req: Request, res: Response) => {
    const project: Project = {
        id: projects.length + 1,
        name: req.body.name,
        description: req.body.description,
        language: req.body.language,
        stars: 0,
        bounty: req.body.bounty || 0
    };
    projects.push(project);
    res.json(project);
});

app.listen(PORT, () => {
    console.log(`🚀 Marketplace API running on port ${PORT}`);
});
