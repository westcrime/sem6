import * as fs from 'fs';
import * as path from 'path';

interface Model {
  save(): void;
  delete(): void;
}

type ForeignKey<T> = T & { _id: number };
type ManyToManyField<T> = T[];

abstract class BaseModel implements Model {
  private static data: any[] = [];
  private static filePath: string;

  public id?: number;

  constructor() {
    const constructor = this.constructor as typeof BaseModel;
    if (!constructor.filePath) {
      constructor.filePath = path.join(__dirname, `${constructor.name.toLowerCase()}s.json`);
      this.loadData();
    }
  }

  private loadData(): void {
    const constructor = this.constructor as typeof BaseModel;
    if (fs.existsSync(constructor.filePath)) {
      const fileContent = fs.readFileSync(constructor.filePath, 'utf8');
      constructor.data = JSON.parse(fileContent);
    }
  }

  private saveData(): void {
    const constructor = this.constructor as typeof BaseModel;
    fs.writeFileSync(constructor.filePath, JSON.stringify(constructor.data));
  }

  public save(): void {
    const constructor = this.constructor as typeof BaseModel;
    if (this.id === undefined) {
      this.id = constructor.data.length + 1;
      constructor.data.push(this);
    } else {
      const index = constructor.data.findIndex((item: any) => item.id === this.id);
      constructor.data[index] = this;
    }
    this.saveData();
  }

  public delete(): void {
    const constructor = this.constructor as typeof BaseModel;
    constructor.data = constructor.data.filter((item: any) => item.id !== this.id);
    this.saveData();
  }

  public static all<T extends BaseModel>(this: new () => T): T[] {
    const constructor = this as typeof BaseModel;
    return constructor.data.map((data: any) => Object.assign(new this(), data));
  }

  public static get<T extends BaseModel>(this: new () => T, id: number): T | null {
    const constructor = this as typeof BaseModel;
    const data = constructor.data.find((item: any) => item.id === id);
    return data ? Object.assign(new this(), data) : null;
  }
}

class Blog extends BaseModel {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    super();
    this.name = name;
    this.url = url;
  }
}

class Author extends BaseModel {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

class Post extends BaseModel {
  title: string;
  content: string;
  published: boolean;
  blog: ForeignKey<Blog>;
  authors: ManyToManyField<Author>;

  constructor(title: string, content: string, published: boolean, blog: ForeignKey<Blog>, authors: ManyToManyField<Author>) {
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

const post = new Post('My First Post', 'This is the content of my first post.', true, blog as ForeignKey<Blog>, [author1, author2] as ManyToManyField<Author>);
post.save();

console.log(Post.all());  // Выводит все посты
console.log(Blog.all());  // Выводит все блоги
console.log(Author.all());  // Выводит всех авторов
