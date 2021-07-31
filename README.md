# Iframe communication example

## Get Started

Open 2 terminal and setup 2 http server

```shell
cd iframe-communication-example
python3 -m http.server 8000
```

```shell
cd iframe-communication-example
python3 -m http.server 9000
```

Open [http://0.0.0.0:8000/outer.html](http://0.0.0.0:8000/outer.html) and you can see child frame `inner.html` which hosted on [http://0.0.0.0:9000/](http://0.0.0.0:9000/inner.html)

Click ![+1](https://img.shields.io/badge/-%2B1-lightgrey) in `outer.html` and type something to \<input> field in `inner.html`

Then you can click ![ask](https://img.shields.io/badge/-ask%20to%20XXX-lightgrey) in both frames

## Concept

- [https://hackmd.io/@flandrekawaii/iframe_communication](https://hackmd.io/@flandrekawaii/iframe_communication)

## License

MIT
