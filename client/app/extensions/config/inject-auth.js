export default function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}
