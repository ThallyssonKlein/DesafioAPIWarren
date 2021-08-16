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
