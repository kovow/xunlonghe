import {http} from '../utils/ajax';
// 获取角色信息
export async function queryRoleList() {
  return http.get('/admin/api/role/list');
}
// 获取权限信息
export async function queryPermissionList(){
  return http.get('/admin/api/menu/all');
}
// 添加角色
export async function addRole(payload){
  return http.post('/admin/api/role/add',payload);
}
// 获取用户信息
export async function queryUserList(){
  return http.get('/admin/api/user/list');
}
// 添加用户
export async function addUser(payload){
  return http.post('/admin/api/user/add',payload);
}
// 获取编辑的角色信息
export async function queryEditRole(id){
  return http.get(`/admin/api/role/${id}/get`);
}
// 编辑角色信息
export async function updateRole(id,payload){
  return http.post(`/admin/api/role/${id}/modify`,payload);
}
// 获取编辑用户信息
export async function queryEditUser(id){
  return http.get(`/admin/api/user/${id}/get`);
}
// 修改用户信息
export async function updateUser(id,payload){
  return http.post(`/admin/api/user/${id}/modify`,payload);
}
// 修改用户状态
export async function updateUserStatus(id){
  return http.post(`/admin/api/user/${id}/status/modify`);
}