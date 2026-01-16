import 'dart:convert';
import 'package:hrm_mobile/core/api/api_client.dart';
import 'package:hrm_mobile/core/auth/secure_storage.dart';
import 'package:hrm_mobile/features/auth/models/user.dart';

class AuthService {
  User? _currentUser;
  bool _isAuthenticated = false;

  User? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;

  Future<bool> login(String email, String password) async {
    try {
      final response = await apiClient.post('/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final token = response.data['token'];
        final userData = response.data['user'];

        await SecureStorage.saveToken(token);
        await SecureStorage.saveUserData(jsonEncode(userData));

        _currentUser = User.fromJson(userData);
        _isAuthenticated = true;
        return true;
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await apiClient.post('/logout');
    } catch (e) {
      print('Logout API error: $e');
    } finally {
      await SecureStorage.clearAll();
      _currentUser = null;
      _isAuthenticated = false;
    }
  }

  Future<bool> checkAuthStatus() async {
    final token = await SecureStorage.getToken();
    final userDataString = await SecureStorage.getUserData();

    if (token != null && userDataString != null) {
      _currentUser = User.fromJson(jsonDecode(userDataString));
      _isAuthenticated = true;
      return true;
    }

    _isAuthenticated = false;
    return false;
  }
}

final authService = AuthService();
