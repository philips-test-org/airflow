import {getOrderResource} from "../../app/lib/selectors";

describe("getOrderResource", () => {
  it("always get the adjusted resource, if both rad exam resource id and adjusted resource id are present", () => {
    const resources = [{id: 1}, {id: 2}];
    const order = {adjusted: {resource_id: 2}, rad_exam: {resource_id: 1}, resource: {id: 3}};
    expect(getOrderResource(resources, order)).toEqual({id: 2});
  });

  it("Get the resource in the order if none of the resource id's matched", () => {
    const resources = [{id: 1}];
    const order = {adjusted: {resource_id: 2}, rad_exam: {resource_id: 1}, resource: {id: 3}};
    expect(getOrderResource(resources, order)).toEqual({id: 1});
  });

  it("Get the resource in the order if none of the resource id's matched", () => {
    const resources = [{id: 88}, {id: 99}];
    const order = {adjusted: {resource_id: 2}, rad_exam: {resource_id: 1}, resource: {id: 3}};
    expect(getOrderResource(resources, order)).toEqual({id: 3});
  });
});
