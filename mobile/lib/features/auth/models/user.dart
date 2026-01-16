class User {
  final int id;
  final String name;
  final String email;
  final List<String> roles;
  final Map<String, dynamic>? notificationSettings;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.roles,
    this.notificationSettings,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      roles: List<String>.from(json['roles'] ?? []),
      notificationSettings: json['notification_settings'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'roles': roles,
      'notification_settings': notificationSettings,
    };
  }
}
