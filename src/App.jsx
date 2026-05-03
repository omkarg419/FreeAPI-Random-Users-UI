import { useEffect, useMemo, useState } from "react";

const API_URL = "https://api.freeapi.app/api/v1/public/randomusers";

function formatLocation(user) {
	const city = user?.location?.city || "Unknown city";
	const country = user?.location?.country || "Unknown country";
	return `${city}, ${country}`;
}

function App() {
	const [users, setUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("loading");
	const [error, setError] = useState("");
	const [pageInfo, setPageInfo] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		async function loadUsers() {
			try {
				setStatus("loading");
				setError("");

				const response = await fetch(API_URL, { signal: controller.signal });
				if (!response.ok) {
					throw new Error(`Request failed with status ${response.status}`);
				}

				const payload = await response.json();
				const apiData = payload?.data ?? {};
				const fetchedUsers = Array.isArray(apiData.data) ? apiData.data : [];

				setUsers(fetchedUsers);
				setPageInfo({
					currentPage: apiData.currentPage,
					totalPages: apiData.totalPages,
					totalItems: apiData.totalItems,
					currentPageItems: apiData.currentPageItems,
				});
				setSelectedUserId((current) => current ?? fetchedUsers[0]?.id ?? null);
				setStatus("success");
			} catch (fetchError) {
				if (fetchError.name === "AbortError") return;

				setError(fetchError.message || "Unable to load users");
				setStatus("error");
			}
		}

		loadUsers();

		return () => controller.abort();
	}, []);

	const filteredUsers = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return users;

		return users.filter((user) => {
			const searchableFields = [
				user?.name?.first,
				user?.name?.last,
				user?.email,
				user?.location?.city,
				user?.location?.country,
			];

			return searchableFields.some((field) =>
				String(field || "")
					.toLowerCase()
					.includes(normalizedQuery),
			);
		});
	}, [query, users]);

	const selectedUser =
		users.find((user) => user.id === selectedUserId) ?? users[0] ?? null;

	return (
		<main className="app-shell">
			<section className="hero-card">
				<div className="hero-copy">
					<span className="eyebrow">FreeAPI random users</span>
					<h1>Profile-style user gallery</h1>
					<p>
						A polished React interface for browsing random people from the
						FreeAPI endpoint, complete with cards, search, and a focused detail
						panel.
					</p>
				</div>

				<div className="hero-actions">
					<label
						className="search-field"
						htmlFor="user-search"
					>
						<span>Search users</span>
						<input
							id="user-search"
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Name, email, city, or country"
						/>
					</label>

					<button
						type="button"
						className="refresh-button"
						onClick={() => window.location.reload()}
					>
						Reload data
					</button>
				</div>
			</section>

			<section
				className="stats-row"
				aria-label="API summary"
			>
				<article className="stat-card">
					<span className="stat-label">Status</span>
					<strong>{status}</strong>
				</article>
				<article className="stat-card">
					<span className="stat-label">Loaded users</span>
					<strong>{users.length}</strong>
				</article>
				<article className="stat-card">
					<span className="stat-label">Filtered users</span>
					<strong>{filteredUsers.length}</strong>
				</article>
				<article className="stat-card">
					<span className="stat-label">Page</span>
					<strong>
						{pageInfo
							? `${pageInfo.currentPage} / ${pageInfo.totalPages}`
							: "—"}
					</strong>
				</article>
			</section>

			{error ? (
				<section
					className="message-card error-card"
					role="alert"
				>
					<h2>Could not load users</h2>
					<p>{error}</p>
				</section>
			) : null}

			{selectedUser ? (
				<section className="focus-card">
					<div className="focus-image-wrap">
						<img
							src={selectedUser.picture?.large}
							alt={`${selectedUser.name?.first || "User"} ${selectedUser.name?.last || ""}`.trim()}
							className="focus-image"
						/>
					</div>

					<div className="focus-content">
						<span className="focus-badge">Selected profile</span>
						<h2>
							{selectedUser.name?.title} {selectedUser.name?.first}{" "}
							{selectedUser.name?.last}
						</h2>
						<p className="focus-subtitle">{formatLocation(selectedUser)}</p>

						<div className="focus-grid">
							<div>
								<span>Email</span>
								<strong>{selectedUser.email}</strong>
							</div>
							<div>
								<span>Phone</span>
								<strong>{selectedUser.phone}</strong>
							</div>
							<div>
								<span>Username</span>
								<strong>@{selectedUser.login?.username}</strong>
							</div>
							<div>
								<span>Age</span>
								<strong>{selectedUser.dob?.age}</strong>
							</div>
						</div>
					</div>
				</section>
			) : null}

			<section
				className="users-grid"
				aria-label="Random user cards"
			>
				{status === "loading" ? (
					<article className="message-card">Loading users...</article>
				) : null}

				{status !== "loading" && filteredUsers.length === 0 ? (
					<article className="message-card">
						No users match your search.
					</article>
				) : null}

				{filteredUsers.map((user) => {
					const isActive = user.id === selectedUser?.id;

					return (
						<button
							key={user.id}
							type="button"
							className={`user-card ${isActive ? "active" : ""}`}
							onClick={() => setSelectedUserId(user.id)}
						>
							<img
								src={user.picture?.medium}
								alt={`${user.name?.first || "User"} ${user.name?.last || ""}`.trim()}
								className="user-avatar"
							/>

							<div className="user-card-body">
								<div className="user-card-topline">
									<h3>
										{user.name?.first} {user.name?.last}
									</h3>
									<span>{user.gender}</span>
								</div>
								<p>{user.email}</p>
								<p>{formatLocation(user)}</p>
							</div>
						</button>
					);
				})}
			</section>
		</main>
	);
}

export default App;
