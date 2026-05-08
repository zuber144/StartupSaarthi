import httpx
import asyncio

async def test_auth():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        # Test Signup
        signup_data = {
            "email": "testuser@example.com",
            "password": "testpassword",
            "full_name": "Test User",
            "role": "founder"
        }
        try:
            response = await client.post("/api/v1/auth/signup", json=signup_data)
            print(f"Signup Status: {response.status_code}")
            print(f"Signup Response: {response.json()}")
        except Exception as e:
            print(f"Signup failed: {e}")

        # Test Login
        login_data = {
            "email": "testuser@example.com",
            "password": "testpassword"
        }
        try:
            response = await client.post("/api/v1/auth/login", json=login_data)
            print(f"Login Status: {response.status_code}")
            print(f"Login Response: {response.json()}")
        except Exception as e:
            print(f"Login failed: {e}")

if __name__ == "__main__":
    # Note: This requires the server to be running!
    # asyncio.run(test_auth())
    pass
