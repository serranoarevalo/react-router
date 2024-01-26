import * as React from "react";
import * as TestRenderer from "react-test-renderer";
import {
  AbsoluteRoutes,
  MemoryRouter,
  Routes,
  Route,
  createRoutesFromElements,
  useRoutes,
  useAbsoluteRoutes,
} from "react-router";

describe("<AbsoluteRoutes>/useAbsoluteRoutes", () => {
  it("<AbsoluteRoutes> treats descendant route paths as absolute", () => {
    function App({ url }) {
      return (
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/auth/*" element={<Auth />} />
          </Routes>
        </MemoryRouter>
      );
    }

    function Auth() {
      return (
        <AbsoluteRoutes>
          <Route path="/auth/login" element={<h2>Auth Login</h2>} />
          <Route path="does-not-work" element={<h2>Nope</h2>} />
          <Route path="/auth/*" element={<h2>Not Found</h2>} />
        </AbsoluteRoutes>
      );
    }

    // Matches absolute descendant routes
    let renderer: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer = TestRenderer.create(<App url="/auth/login" />);
    });

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h2>
        Auth Login
      </h2>
    `);

    // Falls through to splat/not-found routes
    let renderer2: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer2 = TestRenderer.create(<App url="/auth/junk" />);
    });

    expect(renderer2.toJSON()).toMatchInlineSnapshot(`
      <h2>
        Not Found
      </h2>
    `);

    // Does not match child relative paths
    let renderer3: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer3 = TestRenderer.create(<App url="/auth/does-not-work" />);
    });

    expect(renderer3.toJSON()).toMatchInlineSnapshot(`
      <h2>
        Not Found
      </h2>
    `);
  });

  it("useAbsoluteRoutes() treats descendant route paths as absolute", () => {
    function App({ url }) {
      return (
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/auth/*" element={<Auth />} />
          </Routes>
        </MemoryRouter>
      );
    }

    function Auth() {
      let childRoutes = createRoutesFromElements(
        <>
          <Route path="/auth/login" element={<h2>Auth Login</h2>} />
          <Route path="does-not-work" element={<h2>Nope</h2>} />
          <Route path="*" element={<h2>Not Found</h2>} />
        </>
      );
      return useAbsoluteRoutes(childRoutes);
    }

    // Matches absolute descendant routes
    let renderer: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer = TestRenderer.create(<App url="/auth/login" />);
    });

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h2>
        Auth Login
      </h2>
    `);

    // Falls through to splat/not-found routes
    let renderer2: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer2 = TestRenderer.create(<App url="/auth/junk" />);
    });

    expect(renderer2.toJSON()).toMatchInlineSnapshot(`
      <h2>
        Not Found
      </h2>
    `);

    // Does not match child relative paths
    let renderer3: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer3 = TestRenderer.create(<App url="/auth/does-not-work" />);
    });

    expect(renderer3.toJSON()).toMatchInlineSnapshot(`
      <h2>
        Not Found
      </h2>
    `);
  });
});
