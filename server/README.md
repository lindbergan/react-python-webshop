Start Postgres server
```
docker compose up --build -d
```

Create tables
```
python main.py
```

Run API

```
python -m uvicorn src.api.api:app --reload
```


Run tests

```
docker exec -it webshop_api python -m pytest -v -s
```

Down volumes
```
docker compose down -v
```