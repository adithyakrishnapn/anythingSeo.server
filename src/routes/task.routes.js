import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";

const router = Router();

/* ===========================
   CRUD
=========================== */

router.post("/", taskController.createTask);

router.get("/", taskController.getAllTasks);

router.get("/:id", taskController.getTaskById);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);


/* ===========================
   STATUS
=========================== */

router.patch("/:id/status", taskController.updateTaskStatus);

router.post("/:id/followup", taskController.sendTaskFollowUp);


/* ===========================
   NOTES
=========================== */

router.post("/:id/notes", taskController.addNote);

router.delete("/:id/notes/:noteIndex", taskController.removeNote);


/* ===========================
   COMMENTS
=========================== */

router.post("/:id/comments", taskController.addComment);


/* ===========================
   ATTACHMENTS
=========================== */

router.post("/:id/attachments", taskController.addAttachment);

router.delete(
    "/:id/attachments/:attachmentId",
    taskController.removeAttachment
);


/* ===========================
   DASHBOARD
=========================== */

router.get("/status/pending", taskController.getPendingTasks);

router.get("/status/overdue", taskController.getOverdueTasks);

router.get("/status/today", taskController.getTasksDueToday);

export default router;