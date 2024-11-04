import { Router } from 'express';
import { NoteController } from '../controllers/note.controllers';
import pool from '../config/database';
import { NoteService } from '../service/note.service';
import { checkUser } from '../middleware';

// 实例化 NoteController，并注入 NoteService
const router = Router();
const noteController = new NoteController(new NoteService(pool));

// 获取特定捐赠者的所有备注
router.get('/notes/:donorId', checkUser, noteController.getNotesByDonorId);

// 添加新的备注
router.post('/notes', checkUser, noteController.addNote);

export default router;
