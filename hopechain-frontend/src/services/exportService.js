// Export service for demo data
class ExportService {
  // Export data as JSON
  exportAsJSON(data, filename = 'hopechain-data.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    this.downloadFile(jsonStr, filename, 'application/json');
  }

  // Export data as CSV
  exportAsCSV(data, filename = 'hopechain-data.csv') {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    this.downloadFile(csvContent, filename, 'text/csv');
  }

  // Export data as PDF (simplified version)
  exportAsPDF(data, filename = 'hopechain-data.pdf') {
    // For demo purposes, we'll create a simple text-based PDF
    // In a real implementation, you would use a library like jsPDF
    
    let content = `HopeChain Data Export\n`;
    content += `Exported on: ${new Date().toLocaleString()}\n\n`;
    
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        content += `--- Record ${index + 1} ---\n`;
        Object.entries(item).forEach(([key, value]) => {
          content += `${key}: ${value}\n`;
        });
        content += '\n';
      });
    } else {
      Object.entries(data).forEach(([key, value]) => {
        content += `${key}: ${value}\n`;
      });
    }
    
    this.downloadFile(content, filename, 'application/pdf');
  }

  // Download file helper
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  }

  // Export user profile
  exportUserProfile(user) {
    const exportData = {
      exportType: 'userProfile',
      exportedAt: new Date().toISOString(),
      userId: user.id,
      name: user.name,
      email: user.email,
      type: user.type, // Changed from userType to type
      phone: user.phone,
      location: user.location,
      createdAt: user.createdAt,
      stats: {
        hopePoints: 42,
        connections: 3,
        impactScore: 7
      }
    };
    
    this.exportAsJSON(exportData, `hopechain-profile-${user.name.replace(/\s+/g, '-')}.json`);
  }

  // Export connections
  exportConnections(connections) {
    const exportData = {
      exportType: 'connections',
      exportedAt: new Date().toISOString(),
      count: connections.length,
      connections: connections.map(conn => ({
        id: conn.id,
        status: conn.status,
        createdAt: conn.createdAt,
        postTitle: conn.post?.title,
        otherUserName: conn.otherUser?.name,
        messageCount: conn.messages?.length || 0
      }))
    };
    
    this.exportAsJSON(exportData, 'hopechain-connections.json');
    this.exportAsCSV(exportData.connections, 'hopechain-connections.csv');
  }

  // Export posts (offers and needs)
  exportPosts(offers = [], needs = []) {
    const exportData = {
      exportType: 'posts',
      exportedAt: new Date().toISOString(),
      offers: {
        count: offers.length,
        data: offers.map(offer => ({
          id: offer.id,
          title: offer.title,
          description: offer.description,
          resourceType: offer.resourceType,
          location: offer.location,
          createdAt: offer.createdAt,
          isActive: offer.isActive
        }))
      },
      needs: {
        count: needs.length,
        data: needs.map(need => ({
          id: need.id,
          title: need.title,
          description: need.description,
          resourceType: need.resourceType,
          location: need.location,
          urgency: need.urgency,
          createdAt: need.createdAt,
          isActive: need.isActive,
          isFulfilled: need.isFulfilled
        }))
      }
    };
    
    this.exportAsJSON(exportData, 'hopechain-posts.json');
  }
}

// Create a singleton instance
const exportService = new ExportService();

export default exportService;