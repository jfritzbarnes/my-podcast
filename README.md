# my-podcast
curate personal podcasts from a set of podcasts

# running the webapp

```sh
$ docker run -it --rm -p 8080:8080 -p 4200:4200 -v $PWD:/devel --link verdaccio:registry jfritzbarnes/devel:ng bash
$ cd webapp
$ ng server --host 0.0.0.0
```

Starts a development client on port 4200
