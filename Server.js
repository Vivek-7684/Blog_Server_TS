"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var express_1 = require("express");
var validaton_js_1 = require("./validaton.js");
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var cors_1 = require("cors");
var multer_1 = require("multer");
var cookie_parser_1 = require("cookie-parser");
var zod_validation_error_1 = require("zod-validation-error");
var checkAuthandAdmin_1 = require("./checkAuthandAdmin");
var uuid_1 = require("uuid");
var isomorphic_dompurify_1 = require("isomorphic-dompurify");
var app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use("/uploads", express_1.default.static("uploads"));
var connection;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./db"); })];
            case 1:
                connection = _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp") {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid File Type.Only .jpeg,.webp and .png files are Allowed."));
    }
};
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
});
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email_1, password, validationResult, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email_1 = _a.email, password = _a.password;
                if (!email_1 || !password) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Username and password are required." })];
                }
                validationResult = validaton_js_1.loginSchema.safeParse({ email: email_1, password: password });
                if (!validationResult.success) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: (0, zod_validation_error_1.fromZodError)(validationResult.error).message })];
                }
                return [4 /*yield*/, connection.execute("SELECT PASSWORD FROM BlogUser where email = ?", [email_1])];
            case 1:
                result = _b.sent();
                if (result[0].length === 0) {
                    return [2 /*return*/, res.status(401).json({ error: "User does not exist" })];
                }
                bcrypt_1.default.compare(password, result[0][0].PASSWORD, function (err, isMatch) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    else if (!isMatch) {
                        return res.status(401).json({
                            error: "Wrong Email or Password.Please Provide Valid Email and Password.",
                        });
                    }
                    else {
                        var token = jsonwebtoken_1.default.sign({ email: email_1 }, "spiderman@123", {
                            expiresIn: "1h",
                        });
                        res.cookie("token", token, {
                            httpOnly: true,
                            secure: true,
                            maxAge: 3600000,
                        });
                        return res.status(200).json(token);
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ error: err_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/addBlog", checkAuthandAdmin_1.checkAuthandAdmin, upload.fields([
    {
        name: 'sectionImages',
        maxCount: 20
    },
    {
        name: 'image',
        maxCount: 1
    },
    {
        name: 'author_image',
        maxCount: 1
    }
]), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, tags, summary, quote, author, occupation, sections, author_desc, files, image, result, authorImagePath, rowUUID, QueryResult, blogId, parsedSections, sectionImages, i, sec, secImage, err_2;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 6, , 7]);
                _a = req.body, title = _a.title, content = _a.content, tags = _a.tags, summary = _a.summary, quote = _a.quote, author = _a.author, occupation = _a.occupation, sections = _a.sections, author_desc = _a.author_desc;
                files = req.files;
                image = (_b = files === null || files === void 0 ? void 0 : files['image']) === null || _b === void 0 ? void 0 : _b[0];
                if (!title || !content || !image) {
                    return [2 /*return*/, res.status(400).json({ error: "Title, Content and Images are required." })];
                }
                result = validaton_js_1.blogSchema.safeParse({
                    title: req.body.title,
                    content: req.body.content,
                });
                authorImagePath = ((_c = files === null || files === void 0 ? void 0 : files['author_image']) === null || _c === void 0 ? void 0 : _c[0]) ?
                    (_d = files === null || files === void 0 ? void 0 : files['author_image']) === null || _d === void 0 ? void 0 : _d[0].path : null;
                if (!result.success) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: (0, zod_validation_error_1.fromZodError)(result.error).message })];
                }
                rowUUID = (0, uuid_1.v4)();
                return [4 /*yield*/, connection.execute("insert into Blog (id,title, content, image_url, tags, summary, quote, author, occupation,author_desc,author_image) values (?,?,?,?,?,?,?,?,?,?,?) ", [rowUUID, title, isomorphic_dompurify_1.default.sanitize(content), image.path, tags, summary, quote, author, occupation, author_desc, authorImagePath])];
            case 1:
                QueryResult = (_f.sent())[0];
                blogId = rowUUID;
                if (!sections) return [3 /*break*/, 5];
                parsedSections = JSON.parse(sections);
                sectionImages = (files === null || files === void 0 ? void 0 : files['sectionImages']) || [];
                i = 0;
                _f.label = 2;
            case 2:
                if (!(i < parsedSections.length)) return [3 /*break*/, 5];
                sec = parsedSections[i];
                secImage = sectionImages[i] ? (_e = sectionImages[i]) === null || _e === void 0 ? void 0 : _e.path : null;
                return [4 /*yield*/, connection.execute("INSERT INTO BlogSection (blog_id, sub_title, content, image_url)\n             VALUES (?, ?, ?, ?)", [blogId, sec.subTitle, sec.content, secImage])];
            case 3:
                _f.sent();
                _f.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, res.status(201).json({ message: "Blog Created Successfully!" })];
            case 6:
                err_2 = _f.sent();
                return [2 /*return*/, res.status(500).json({ error: err_2.message })];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.get("/blog", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, sql, params, rows, blogsMap, response, blog, prevRows, nextRows, relatedPosts, tagsArray_1, related;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.query.title;
                sql = "\n    SELECT \n      b.id AS blog_id, \n      b.title,\n      b.content AS blog_content,\n      b.image_url AS blog_image,\n      b.created_at,\n      b.quote,\n      b.summary,\n      b.tags,\n      b.author,\n      b.author_image,\n      b.author_desc,\n      b.occupation,\n      b.views,\n      bs.id AS section_id,\n      bs.sub_title,\n      bs.content AS section_content,\n      bs.image_url AS section_image\n    FROM Blog b\n    LEFT JOIN BlogSection bs ON b.id = bs.blog_id\n    WHERE 1=1\n  ";
                params = [];
                if (!title) return [3 /*break*/, 2];
                sql += " AND b.title = ?";
                params.push(title);
                return [4 /*yield*/, connection.execute("update blog set views = views + 1 where title = ?", [title])];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, connection.execute(sql, params)];
            case 3:
                rows = (_a.sent())[0];
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({
                            message: "No Blog is available to show. Please Add Your Blog."
                        })];
                }
                blogsMap = {};
                rows.forEach(function (row) {
                    var _a;
                    if (!blogsMap[row.blog_id]) {
                        blogsMap[row.blog_id] = {
                            blog_id: row.blog_id,
                            title: row.title,
                            content: row.blog_content,
                            image_url: row.blog_image,
                            created_at: row.created_at,
                            tags: row.tags,
                            quote: row.quote,
                            summary: row.summary,
                            author: row.author,
                            occupation: row.occupation,
                            author_image: row.author_image,
                            author_desc: row.author_desc,
                            views: row.views,
                            sections: []
                        };
                    }
                    if (row.section_id) {
                        (_a = blogsMap[row.blog_id]) === null || _a === void 0 ? void 0 : _a.sections.push({
                            section_id: row.section_id,
                            sub_title: row.sub_title,
                            content: row.section_content,
                            image_url: row.section_image
                        });
                    }
                });
                response = Object.values(blogsMap);
                blog = response[0];
                return [4 /*yield*/, connection.execute("SELECT title, image_url \n   FROM Blog \n   WHERE created_at < ? \n   ORDER BY created_at DESC \n   LIMIT 1", [blog.created_at])];
            case 4:
                prevRows = (_a.sent())[0];
                return [4 /*yield*/, connection.execute("SELECT title, image_url \n   FROM Blog \n   WHERE created_at > ? \n   ORDER BY created_at ASC \n   LIMIT 1", [blog.created_at])];
            case 5:
                nextRows = (_a.sent())[0];
                // attach to blog response
                blog.previousPost = prevRows.length > 0 ? prevRows[0] : null;
                blog.nextPost = nextRows.length > 0 ? nextRows[0] : null;
                relatedPosts = [];
                if (!blog.tags) return [3 /*break*/, 7];
                tagsArray_1 = blog.tags.split(',').map(function (t) { return t.trim().toLowerCase(); });
                return [4 /*yield*/, connection.execute("SELECT title, image_url, tags \n     FROM Blog \n     WHERE id != ? \n     LIMIT 20", [blog.blog_id])];
            case 6:
                related = (_a.sent())[0];
                relatedPosts = related.filter(function (post) {
                    if (!post.tags)
                        return false;
                    var postTags = post.tags.split(',').map(function (t) { return t.trim().toLowerCase(); });
                    return postTags.some(function (tag) { return tagsArray_1.includes(tag); });
                }).slice(0, 3);
                _a.label = 7;
            case 7:
                blog.relatedPosts = relatedPosts;
                res.status(200).json(response);
                return [2 /*return*/];
        }
    });
}); });
app.post("/comment/add", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, blog_id, name_1, comment, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, blog_id = _a.blog_id, name_1 = _a.name, comment = _a.comment;
                if (!blog_id || !name_1 || !comment) {
                    return [2 /*return*/, res.status(400).json({ error: "Name and comment are required." })];
                }
                return [4 /*yield*/, connection.execute("INSERT INTO Comments (blog_id, name, comment) VALUES (?, ?, ?)", [blog_id, name_1, comment])];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ message: "Comment added successfully." })];
            case 2:
                err_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({ error: err_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/comment/:blogId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blogId, rows, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                blogId = req.params.blogId;
                return [4 /*yield*/, connection.execute("SELECT name, comment, created_at FROM Comments WHERE blog_id = ? ORDER BY created_at DESC", [blogId])];
            case 1:
                rows = (_a.sent())[0];
                res.status(200).json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(500).json({ error: err_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT, function () {
    console.log("Server is running on port 3000");
});
