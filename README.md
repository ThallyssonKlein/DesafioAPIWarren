# Endpoints

## /auth

* **POST**: /login
  * Request Body:
    * email
    * password
  * Returns:
    * Response Headers:
      * x-access-token

## /users

* **GET**: /
  * Request Headers:
    * x-access-token
  * Returns:
    * Response Body:
      * name
      * email
      * cpf

* **POST**: /
  * Request Body:
    * name
    * email
    * cpf
    * password
  * Returns:
    * Response Body:
      * id

* **DELETE**: /
  * Request Headers:
    * x-access-token

### Banking (/users)

* **GET**: /balance
  * Request Headers:
    * x-access-token
  * Returns:
    * Response Body:
      * balance

* **GET**: /history
  * Request Headers:
    * x-access-token
  * Returns:
    * Response Body:
      * history

* **POST**: /deposit
  * Request Headers:
    * x-access-token
  * Request Body:
    * amount

* **POST**: /withdraw
  * Request Headers:
    * x-access-token
  * Request Body:
    * amount

* **POST**: /pay
  * Request Headers:
    * x-access-token
  * Request Body:
    * amount
    * receiver

# How to run

- [ ] Install the [docker](https://docs.docker.com/engine/install/) and the [docker-compose](https://docs.docker.com/compose/install/) if you have not yet installed
- [ ] Run the command below

```
sudo docker-compose up -d
```

## The frontend address:

```
http://localhost:3000
```

## The API base URL

```
http://localhost:80/
```

## The project configuration files

You can find the project configuration files in /data or in the .envs inside each component folder