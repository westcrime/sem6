import * as fs from 'fs';
import * as path from 'path';

class BaseModel {
    static data = [];
    static filePath;
    id;
    constructor() {
        const constructor = this.constructor;
        if (!constructor.filePath) {
            constructor.filePath = path.join(__dirname, `${constructor.name.toLowerCase()}s.json`);
            this.loadData();
        }
    }
    loadData() {
        const constructor = this.constructor;
        if (fs.existsSync(constructor.filePath)) {
            const fileContent = fs.readFileSync(constructor.filePath, 'utf8');
            constructor.data = JSON.parse(fileContent);
        }
    }
    saveData() {
        const constructor = this.constructor;
        fs.writeFileSync(constructor.filePath, JSON.stringify(constructor.data));
    }
    save() {
        const constructor = this.constructor;
        if (this.id === undefined) {
            this.id = constructor.data.length + 1;
            constructor.data.push(this);
        }
        else {
            const index = constructor.data.findIndex((item) => item.id === this.id);
            constructor.data[index] = this;
        }
        this.saveData();
    }
    delete() {
        const constructor = this.constructor;
        constructor.data = constructor.data.filter((item) => item.id !== this.id);
        this.saveData();
    }
    static all() {
        const constructor = this;
        return constructor.data.map((data) => Object.assign(new this(), data));
    }
    static get(id) {
        const constructor = this;
        const data = constructor.data.find((item) => item.id === id);
        return data ? Object.assign(new this(), data) : null;
    }
}
class Blog extends BaseModel {
    name;
    url;
    constructor(name, url) {
        super();
        this.name = name;
        this.url = url;
    }
}
class Author extends BaseModel {
    name;
    constructor(name) {
        super();
        this.name = name;
    }
}
class Post extends BaseModel {
    title;
    content;
    published;
    blog;
    authors;
    constructor(title, content, published, blog, authors) {
        super();
        this.title = title;
        this.content = content;
        this.published = published;
        this.blog = blog;
        this.authors = authors;
    }
}
// Пример использования
const blog = new Blog('My Blog', 'http://myblog.com');
blog.save();
const author1 = new Author('John Doe');
author1.save();
const author2 = new Author('Jane Smith');
author2.save();
const post = new Post('My First Post', 'This is the content of my first post.', true, blog, [author1, author2]);
post.save();
console.log(Post.all()); // Выводит все посты
console.log(Blog.all()); // Выводит все блоги
console.log(Author.all()); // Выводит всех авторов
