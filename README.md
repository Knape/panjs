## panJS

### Description
Pan images without dependencies

### Install with npm

```bash
npm install --save panjs
```

### Install with bower

```bash
bower install panjs --save
```

## Usage

### Prerequisited markup

```html
<div class="img-wrapper">
    <img src="" alt="">
</div>
```

### Prerequisited css

```css
/**

 */
.img-wrapper {
  overflow: hidden;
}

```

### Integration

```js
  import panjs from 'panjs';
  var img = document.querySelectorAll('img');

  panjs(img, {
    // options going here, at the moment we do not support any options
  });
```

## Public API

<table>
  <tr>
    <td>setup</td>
    <td>Binds eventlisteners, merging default and user options, setup the pan based on DOM (called once during initialisation). Call setup if DOM or user options have changed or eventlisteners needs to be rebinded.</td>
  </tr>
  <tr>
    <td>reset</td>
    <td>sets the pan back to the starting position</td>
  </tr>
  <tr>
    <td>destroy</td>
    <td>destroys the panjs instance by removing all panjs specific event listeners</td>
  </tr>
</table>

## License

[MIT](LICENSE). Copyright (c) 2016 Philip Knape.
