# 🎨 Team Collaboration Platform with Whiteboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![React 18](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

> **Production-ready team collaboration platform with real-time whiteboard functionality**

## 📸 Screenshots

*Coming soon: Screenshots will be added here to showcase the application interface*

### 🏠 Dashboard
<!-- Add dashboard screenshots to screenshots/dashboard/ -->

### 🎨 Whiteboard
<!-- Add whiteboard screenshots to screenshots/whiteboard/ -->

### 📁 Projects
<!-- Add project management screenshots to screenshots/projects/ -->

### 👥 Team Management
<!-- Add team management screenshots to screenshots/team/ -->

### 🔐 Authentication
<!-- Add authentication screenshots to screenshots/auth/ -->

### 📱 Mobile Responsive
<!-- Add mobile screenshots to screenshots/mobile/ -->

## 🚀 Overview

**Team Collaboration Platform** is a modern, production-ready application that provides teams with powerful collaboration tools including real-time whiteboards, project management, and team organization features. Built with React 18, TypeScript, and Docker, it solves common integration challenges while providing an extensible foundation for your next team app.

> **Note**: This project was originally forked from [alswl/excalidraw-collaboration](https://github.com/alswl/excalidraw-collaboration) and has been significantly enhanced with production features and React 18 compatibility.

## ✨ Enhanced Features

### 🎯 What Makes This Version Better

| Feature | Original | Enhanced Version |
|---------|----------|------------------|
| **React Compatibility** | React version conflicts | ✅ **Solved** with smart iframe approach |
| **Production Ready** | Basic setup | ✅ **Dockerized** with proper architecture |
| **TypeScript** | Limited | ✅ **Full TypeScript** support |
| **Error Handling** | Basic | ✅ **Comprehensive** loading states & error handling |
| **UI/UX** | Functional | ✅ **Modern** design with Tailwind CSS |
| **Extensibility** | Specific use case | ✅ **Modular** foundation for any team app |

### 🛠️ Core Features

- **🎨 Real-time Whiteboards** - Powered by Excalidraw with collaboration
- **👥 Team Management** - User authentication and team organization  
- **📁 Project Organization** - Structured project and team management
- **🚀 Modern Tech Stack** - React 18, TypeScript, Docker, PostgreSQL
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🔒 Secure Authentication** - JWT-based user sessions
- **🐳 Docker First** - Zero-config setup with Docker Compose

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     API          │    │   Database      │
│                 │    │                  │    │                 │
│ • React 18      │◄──►│ • Node.js        │◄──►│ • PostgreSQL    │
│ • TypeScript    │    │ • TypeScript     │    │ • Redis         │
│ • Vite          │    │ • Express        │    │                 │
│ • Tailwind CSS  │    │ • JWT Auth       │    └─────────────────┘
└─────────────────┘    └──────────────────┘
           │
           │ Iframe
           ▼
┌─────────────────┐
│   Excalidraw    │
│                 │
│ • Local         │
│ • No React      │
│   Conflicts     │
└─────────────────┘
```

## 🚀 Quick Start

Get started in under 5 minutes with our Docker-first setup:

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/team-collaboration-platform.git
   cd team-collaboration-platform
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Excalidraw: http://localhost:8080
   - API: http://localhost:3001

4. **Create your first whiteboard**
   - Login with the default credentials
   - Navigate to the whiteboard section
   - Start collaborating in real-time!

### Default Credentials
- **Username**: `admin`
- **Password**: `password`

## 🛠️ Development

### Local Development Setup

1. **Install dependencies**
   ```bash
   cd app && yarn install
   cd ../api && npm install
   ```

2. **Start development servers**
   ```bash
   # Frontend (app)
   cd app && yarn dev

   # Backend (api) 
   cd api && npm run dev
   ```

3. **Environment Configuration**
   Copy the example environment files and configure as needed:
   ```bash
   cp api/.env.example api/.env
   ```

## 🎨 Customization

### Adding New Features

The modular architecture makes it easy to extend:

```typescript
// Example: Adding a new page
// app/src/pages/NewFeature.tsx
import React from 'react';

const NewFeature: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your New Feature</h1>
      {/* Your component content */}
    </div>
  );
};

export default NewFeature;
```

### Whiteboard Integration

Our smart iframe approach eliminates React version conflicts:

```typescript
// app/src/components/WhiteboardEmbed/WhiteboardEmbed.tsx
const WhiteboardEmbed: React.FC<WhiteboardEmbedProps> = () => {
  // Simple iframe integration - no React conflicts!
  return <iframe src="http://localhost:8080" />;
};
```

## 📚 API Documentation

### Authentication Endpoints

```bash
# Login
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}

# Get current user
GET /api/auth/me
```

### Whiteboard Endpoints

```bash
# Create whiteboard
POST /api/whiteboards
{
  "name": "Project Planning",
  "description": "Team brainstorming session"
}

# Get whiteboard
GET /api/whiteboards/:id

# Update whiteboard scene
PUT /api/whiteboards/:id/scene
{
  "sceneData": { ... }
}
```

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Include proper error handling
- Add tests for new features
- Update documentation
- Ensure Docker compatibility

## 🎯 Use Cases

### Perfect For:
- **Remote Teams** - Real-time collaboration from anywhere
- **Project Planning** - Visual brainstorming and planning sessions
- **Education** - Interactive learning environments
- **Design Teams** - Quick mockups and wireframing
- **Startups** - Rapid prototyping and team coordination

### Customization Ideas:
- Add video conferencing integration
- Implement file uploads and sharing
- Create custom whiteboard templates
- Add user roles and permissions
- Integrate with project management tools

## 🗺️ Roadmap

### Coming Soon
- [ ] Real-time chat integration
- [ ] File upload and sharing
- [ ] User roles and permissions
- [ ] Whiteboard templates
- [ ] Export functionality (PNG, PDF)
- [ ] Mobile app

### Community Requests
Have an idea? [Open an issue](https://github.com/your-username/team-collaboration-platform/issues) and let us know!

## 🐛 Troubleshooting

### Common Issues

**Whiteboard not loading?**
- Ensure Excalidraw container is running on port 8080
- Check browser console for errors
- Verify Docker containers are healthy

**Authentication issues?**
- Check database connectivity
- Verify JWT secret configuration
- Clear browser storage and retry

**Need help?**
- Check [existing issues](https://github.com/your-username/team-collaboration-platform/issues)
- Create a new issue with details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original project: [alswl/excalidraw-collaboration](https://github.com/alswl/excalidraw-collaboration)
- [Excalidraw](https://excalidraw.com/) for the amazing whiteboard functionality
- The open source community for invaluable contributions

---

**Ready to build your next team collaboration app?** 

⭐ **Star this repo** if you found it helpful!

🐛 **Found a bug?** [Open an issue](https://github.com/your-username/team-collaboration-platform/issues)

💡 **Have an idea?** We'd love to hear it!

---

*Built with ❤️ for the open source community*
