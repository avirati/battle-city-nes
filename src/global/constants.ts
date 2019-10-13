export const VIEWPORT_SIZE = 800;

export const CELL_SIZE = 16;

export const ARENA_SIZE = VIEWPORT_SIZE / CELL_SIZE;

export const BRICK_IMAGE = 'data:image/jpeg;base64,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';
export const GRASS_IMAGE = 'data:image/png;base64,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';
export const STEEL_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAgFQTFRFAAAA3d3dzc3Nvb29uLi4u7u7vLy8wMDAwcHBwsLCxMTExcXFxsbGx8fHyMjIycnJw8PDubm5xMTE0dHR7e3t1dXVpaWlnJycl5eXmJiYm5ubnp6eoKCgo6OjpaWlqKioqampqqqqra2trq6ur6+vsLCwsbGxsrKys7OzrKysp6enn5+fnZ2dmpqamZmZnp6etLS08fHx3Nzco6Ojk5OTlpaWpqamq6urtLS0tbW1tra2t7e3uLi4ubm5urq6pKSkoaGhlZWVkpKSv7+/8/PzwsLCm5ubu7u7vLy8vb29vr6+v7+/oqKi4uLiwcHBw8PDxMTEwMDA0NDQxcXFxsbGx8fHyMjIycnJysrKwsLCysrKurq6y8vLzMzMzc3Nzs7Oz8/PzMzM0NDQ0tLS09PT1NTU0dHRzc3Nvr6+1dXV1tbW19fX2NjY2dnZ2trazs7Ov7+/29vb3Nzc3d3d3t7ez8/P39/f4ODg4eHh4uLi4+Pj5OTk5eXl5ubm0dHR5+fn6Ojo6enp6urq0tLS6+vr7Ozs09PT7u7u7+/v7e3t1NTU8PDw8fHx8vLy8/Pz1dXV9PT09fX11tbW9vb29/f3+Pj4+fn519fX+vr6+/v7y8vLzs7O5eXlrKyslJSUkZGRxsbG9PT07+/vubm50dHR////7u7u4ODg2NjY6enp+fn5EhBj4gAAAKt0Uk5TAEOfqqqqqqqqqqqqqqqqqqqqpn0sK9z////////////////////////////////21kcizP///////////////////+pZbPP///////+n/////6r/////////qqr//////6r//////6qq////////qqr/////qv//////////qv////+q//+q////qv////+q//+q/////6r//6qgQ9z//+pZK9zqR0OgqqdZmDyQpgAABqxJREFUeJxtlvl3GtcVxydV6niV7TaJkGQBYhvQlrRJWWeQswKDMoCAARzByGwJq8tidsIiZCSxWBJOojhJ2yxtk/yVue+BZKyT7w/S4Zz5nPvue/d+7yUI4pU/zbz65yszr129dv36jZu3Zmdvv9Ds7Oytmzeu37l2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';
export const WATER_IMAGE = 'data:image/png;base64,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';
export const EMPTY_IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAyADIDAREAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAoHCQT/xAAiEAABBAEDBQEAAAAAAAAAAAAEAAMFBwIGFzdXd5e21QH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AtZpimKelaeqeTk6nrWRkpGtdCnyEgfoTS5hx5xml4ogs00siKcIKLKIccfIIfccefeczddzyzyyy/Q0rYmkOjdVePNI/HQNiaQ6N1V480j8dA2JpDo3VXjzSPx0DYmkOjdVePNI/HQNiaQ6N1V480j8dBPtc4AMVcNsRkYEJHRsdZWugI+PAHZDBABD1RKjiBBCD4NjiiCjttsDjsNtssMt4NNYY4Y44/gUE0TwhTfaqvPUYdBqqAgICAgmsvbm+5O6th+3TCDv9RPCFN9qq89Rh0GqoCAgICCay9ub7k7q2H7dMIO/1E8IU32qrz1GHQaqgICAgIJrL25vuTurYft0wg7/UTwhTfaqvPUYdBqqAgICAgmsvbm+5O6th+3TCDv8AUTwhTfaqvPUYdBqqAgICAgmsvbm+5O6th+3TCDyAXPcMUCFGRlsWVHRscIOBHx4Gu9UBggAhs4DiBBCDyrY4ogo7bbA47DbbLDLeDTWGOGOOP4Hr32u/rJavkPV32EDfa7+slq+Q9XfYQN9rv6yWr5D1d9hA32u/rJavkPV32EDfa7+slq+Q9XfYQZqeedKnGycmaXIyUiWQfISB5Dxhx5xj2ZBZppZGbhBRZRDjj5BD7jjz7zmbrueWeWWX6H//2Q==';
