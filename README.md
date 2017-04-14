# Get Types

Look for packages that have typescript types defined in npm registry and add them to package.json

## How to...

```sh
$ npm install -g get-types

$ get-types
```

# Why

### Go from this

```javascript
{
  ...
  "dependencies": {
    "express": "^4.15.2",
    "jquery": "^3.2.1",
    "request": "^2.81.0"
  },
  ...
}
```

### To this

```javascript
{
  ...
  "dependencies": {
    "express": "^4.15.2",
    "jquery": "^3.2.1",
    "request": "^2.81.0"
  },
  "devDependencies": {
    "@types/express": "4.0.35",
    "@types/jquery": "2.0.41",
    "@types/request": "0.0.42"
  }
  ...
}
```

### Todo
- Update functionality