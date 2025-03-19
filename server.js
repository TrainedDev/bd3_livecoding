const express = require("express");
const app = express();

app.use(express.json());

const tasks = [
    {
        id: 1,
        title: 'Fix a critical bug',
        project: 'Project Alpha',
        assignedTo: 'Bob',
        priority: 'high',
        status: 'open'
    },
    {
        id: 2,
        title: 'Implement a new feature',
        project: 'Project Alpha',
        assignedTo: 'Charlie',
        priority: 'medium',
        status: 'in progress'
    },
    {
        id: 3,
        title: 'Write documentation',
        project: 'Project Beta',
        assignedTo: 'Bob',
        priority: 'low',
        status: 'open'
    }
];

//fetch task by name
app.get("/users/:name/tasks", (req, res) => {
    try {
        const { name } = req.params;

        if (!name) return res.status(400).json("required details not found");

        const fetchTask = tasks.filter(ele => ele.assignedTo === name);

        res.status(200).json({ data: fetchTask });

    } catch (error) {
        res.status(500).json({ msg: "failed to fetch tasks", Error: error.message })
    }
});

// fetch pending tasks
app.get("/tasks/pending", async (req, res) => {
    try {
        const fetchPendingTask = tasks.filter(ele => ele.status === "open");
        res.status(200).json({ msg: "successfully fetched pending tasks", data: fetchPendingTask });
    } catch (error) {
        res.status(500).json({ msg: "failed to get pending tasks", Error: error.message })
    }
});

// fetch sorted task by priority
app.get("/tasks/sort/by-priority", async (req, res) => {
    try {
        const sortedTask = tasks.sort((a, b) => b.id - a.id);
        res.status(200).json({ msg: "successfully fetched sorted task", data: sortedTask });
    } catch (error) {
        res.status(500).json({ msg: "failed to get sorted tasks by priority", Error: error.message })
    }
});

//update task status
app.post("/tasks/:id/status", (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        if(!id || !status) return res.status(400).json("required details not found");

        const updatedTask = tasks.filter(ele => ele.id === id ? ele.status = status : tasks);

        res.status(200).json({ msg: "status successfully updated", data: updatedTask });

    } catch (error) {
        res.status(500).json({ msg: "failed to update task", Error: error.message })
    }
})

const isIdUnique = (id) => {
    return !tasks.some(ele => ele.id === id)
};

const projectValidation = (project) => {
    return typeof project === "string";
}

// add new tasks with some validations
app.get("/tasks", (req, res) => {
    try {
        const id = parseInt(req.body.id);
        const { title, project, assignedTo, priority, status } = req.body;

        if (!projectValidation(project)) {
            return res.status(400).json("Provide a valid project");
        }

        if (!isIdUnique(id)) {
            return res.status(400).json("Provide a valid and unique ID");
        }

        if (!id || !title || !project || !assignedTo || !priority || !status) return res.status(400).json("required details not found");


        tasks.push(req.body);

        res.status(200).json({ data: tasks });
    } catch (error) {
        res.status(500).json({ msg: "failed to add new task", Error: error.message })
    }
});

app.get("/", (req, res) => res.send("server is live"));

app.listen(3000, () => console.log("server is ready"));