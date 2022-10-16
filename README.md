
# Multi Participant Shoplist

[M]ulti [P]articipant [S]hoplist or MPS, is a basic online shopping list tool. In MPS You can create a shopping room or session with multiple participants. When both participants are using the application every change will be reflected to other one's screen. Every participant will be in sync with others.


![](https://github.com/ilhanmihaylov/multi-participant-shoplist/blob/main/demo.gif)

## Installation

```bash
  clone the repo
  set up the MongoDB database, preferably MongoDB Atlas
  $ npm i
  rename .env.example to .env and fill all fields
  $ npm start
```

## API Reference

#### Create New Shopping Session

```
  GET /shop/admin/${admincode}/add_shop/${shop_name}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `admincode` | `string` | Admin Code from .env file |
| `shop_name` | `string` | Your shopping session name |

#### Add Participant To Session

```
  GET /shop/admin/${admincode}/add_participant/${shopid}/${participant_name}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `admincode`| `string` | Admin Code from .env file |
| `shopid`      | `string` | Shop id that you just created |
| `participant_name`      | `string` | Participant name as you like |

#### * add_participant API will respond with url you should open with your browser to begin



## FAQ

#### Where is the URL? Which address should I visit?

There is no public URL. You should host yourself for now.

#### Can I use MySQL or <insert any database name here> instead MongoDB?

This is the very early phase of the application which only supports MongoDB.

#### HTTPS? How should I set my certificate?

No support for SSL certificates. If you wish to serve app with HTTPS you should terminate the SSL before request reach to application with something like NGINX.

#### How user and admin session handling works?

There are no sessions. Everything works directly from URL. This is unsafe but speeds up the development process. This is the next thing I should implement.

#### Why entire page reloads when an event happens?

Well, re-rendering entire list is just easier than dynamically manage the list. Again, another sacrifice for speedy development.

