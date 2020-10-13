import React from "react";
import { act, render } from "@testing-library/react";
import App from "./App";
import { Explore, ExploreByUsers, Feed } from "./components";
import renderer from "react-test-renderer";
import { shallow, configure, mount } from "enzyme";
import { Api } from "./api";
import { SortBy } from "./components/explore";
import { Post, User } from "./models";
import Adapter from "enzyme-adapter-react-16";
import { DownOutlined } from "@ant-design/icons";
import { Button, Image } from "antd";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

configure({ adapter: new Adapter() });

describe("<App />", () => {
  it("app renders correctly", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("renders login when no authtoken", () => {
    const { getAllByText } = render(<App />);
    const button = getAllByText(/Log In/i)[0];
    expect(button).toContainHTML("<span>Log In</span>");
  });

  test("does not render explore when no authtoken", () => {
    const { queryByText } = render(<App />);
    const explore = queryByText(/Explore/i);
    expect(explore).toBeNull();
  });
});

describe("<Feed />", () => {
  it("feed renders correctly", () => {
    const tree = renderer
      .create(
        <Feed
          posts={[
            {
              id: "123",
              text: "text",
              images: [{ full_src: "" }],
              created_on: "123",
              user_public_id: "123",
            },
          ]}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders single card text when given properly", () => {
    const { getByText } = render(
      <Feed
        posts={[
          {
            id: "123",
            text: "text",
            images: [{ full_src: "" }],
            created_on: "123",
            user_public_id: "123",
          },
        ]}
      />
    );
    const linkElement = getByText(/text/i);
    expect(linkElement).toBeVisible();
  });
});

function getPostMock(id: string): Post {
  return {
    id: id,
    text: "text",
    images: [{ full_src: "full_src" }],
    created_on: "2020 11 29",
    user_public_id: "user_public_id",
  };
}

function getUserMock(it: string): User {
  return {
    email: it,
    username: "username",
    public_id: "public_id",
  };
}

function getPostsMock() {
  const inner = (
    sortBy: SortBy,
    offset: number | null,
    limit: number | null
  ) => {};
  return inner;
}

const apiMock: Api = {
  login: jest.fn((email, password) =>
    Promise.resolve({ authorization: "authorization" })
  ),
  signup: jest.fn((email, username, password) =>
    Promise.resolve({ authorization: "authorization" })
  ),
  logout: jest.fn(() => Promise.resolve()),
  getPosts: jest.fn((sortBy, offset, limit) =>
    Promise.resolve([getPostMock("1"), getPostMock("2")])
  ),
  newPost: jest.fn((file, text) => Promise.resolve(getPostMock("newPost"))),
  getAllUsers: jest.fn(() => Promise.resolve([getUserMock("a@c")])),
  getUser: jest.fn((publicId) => Promise.resolve(getUserMock(publicId))),
  getPostsByUser: jest.fn((userPublicId) =>
    Promise.resolve([getPostMock("1"), getPostMock("2")])
  ),
};

describe("<Explore />", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Explore
          api={apiMock}
          posts={[getPostMock("1")]}
          getPosts={getPostsMock}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders Explore header even if no posts", () => {
    const wrapper = shallow(
      <Explore api={apiMock} posts={[]} getPosts={getPostsMock()} />
    );
    expect(
      wrapper.contains(<h2 style={{ marginBottom: 0 }}>Explore</h2>)
    ).toBeTruthy();
  });

  it("renders sortBy selector when posts are not empty", () => {
    const wrapper = shallow(
      <Explore
        api={apiMock}
        posts={[getPostMock("1")]}
        getPosts={getPostsMock()}
      />
    );
    expect(
      wrapper.contains(
        <Button type="text">
          Sort By <DownOutlined />
        </Button>
      )
    ).toBeTruthy();
  });

  it("does not render SortBy selector when posts are empty", () => {
    const wrapper = shallow(
      <Explore api={apiMock} posts={[]} getPosts={getPostsMock()} />
    );
    expect(
      wrapper.contains(
        <Button type="text">
          Sort By <DownOutlined />
        </Button>
      )
    ).toBeFalsy();
  });

  it("renders feed when SortBy is by recency", () => {
    const wrapper = shallow(
      <Explore
        api={apiMock}
        posts={[getPostMock("1")]}
        getPosts={getPostsMock()}
      />
    );

    expect(wrapper.contains(<Feed posts={[getPostMock("1")]} />)).toBeTruthy();
  });

  test.skip("renders ExploreByUsers when SortBy is by user", () => {
    const wrapper = shallow(
      <Explore
        api={apiMock}
        posts={[getPostMock("1")]}
        getPosts={getPostsMock()}
      />
    );

    console.log(wrapper.find("Button").simulate("click").debug());
    expect(
      wrapper.contains(
        <ExploreByUsers api={apiMock} posts={[getPostMock("1")]} />
      )
    ).toBeTruthy();
  });
});

describe("<ExploreByUsers />", () => {
  it("renders images when posts are not empty", async () => {
    const wrapper = mount(
      <ExploreByUsers api={apiMock} posts={[getPostMock("1")]} />
    );

    await act(
      () =>
        new Promise<void>((resolve) => {
          setImmediate(() => {
            wrapper.update();
            resolve();
          });
        })
    );

    expect(
      wrapper.contains(
        <Image
          className="image"
          src="http://i2.wp.com/juju.com.hk/wp-content/uploads/2019/11/placeholder.png"
          alt="image"
        />
      )
    ).toBeTruthy();
  });

  it("does not render images when there are no users", async () => {
    var { getAllUsers, ...rest } = apiMock;
    const noUserApiMock = {
      ...rest,
      getAllUsers: jest.fn(() => Promise.resolve([])),
    };
    const wrapper = mount(<ExploreByUsers api={noUserApiMock} posts={[]} />);

    await act(
      () =>
        new Promise<void>((resolve) => {
          setImmediate(() => {
            wrapper.update();
            resolve();
          });
        })
    );

    expect(
      wrapper.contains(
        <Image
          className="image"
          src="http://i2.wp.com/juju.com.hk/wp-content/uploads/2019/11/placeholder.png"
          alt="image"
        />
      )
    ).toBeFalsy();
  });
});
