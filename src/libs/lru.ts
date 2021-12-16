class CacheNode {
  key: number;
  value: string;
  prev: CacheNode;
  next: CacheNode;
  constructor(key: number, value: string) {
    if (typeof key !== 'undefined' || typeof key !== null) {
      this.key = key;
    }
    if (typeof value !== 'undefined' || typeof value !== null) {
      this.value = value;
    }
    this.next = null;
    this.prev = null;
  }
}

export class LRUCache {
  private limit: number;
  private size: number;
  private map: any;
  private head: any;
  private tail: any;
  constructor(limit) {
    if (typeof limit === 'number') {
      this.limit = limit;
    }
    this.size = 0;
    this.map = {};
    this.head = null;
    this.tail = null;
  }

  setHead(n): void {
    n.next = this.head;
    n.prev = null;
    if (this.head !== null) this.head.prev = n;
    this.head = n;
    if (this.tail === null) this.tail = n;
    this.size++;
    this.map[n.key] = n;
  }

  get(key: number): string {
    if (this.map[key]) {
      const value = this.map[key].value;
      const n = new CacheNode(key, value);
      this.remove(key);
      this.setHead(n);
      return value;
    }
  }

  set(key: number, value: string): void {
    const n = new CacheNode(key, value);
    if (this.map[key]) this.remove(key);
    else if (this.size >= this.limit) {
      delete this.map[this.tail];
      this.size--;
      this.tail = this.tail.prev;
      this.tail.next = null;
    }
    this.setHead(n);
  }

  remove(key: number): void {
    if (this.map[key]) {
      const n = this.map[key];
      if (n.prev !== null) n.prev.next = n.next;
      else this.head = n.next;
      if (n.next !== null) n.next.prev = n.prev;
      else this.tail = n.prev;
      delete this.map[key];
      this.size--;
    }
  }
}
