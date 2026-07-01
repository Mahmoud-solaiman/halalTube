import express from 'express';
import authRoutes from './routes/auth.route';
import discRoutes from './routes/disc.route';
import noteRoutes from './routes/note.route';
import youtubeRoutes from './routes/youtube.route';
import passwordRoutes from './routes/passwordReset.route';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/discs', discRoutes);
app.use('/notes', noteRoutes);
app.use('/youtube', youtubeRoutes);
app.use('/password', passwordRoutes);

export default app;