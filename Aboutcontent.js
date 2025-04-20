function loadAboutContent() {
    const section = document.getElementById('about');
    const container = document.getElementById('aboutContent');
    section.classList.remove('d-none');
    section.scrollIntoView({ behavior: 'smooth' });

    const topics = [
      {
        title: 'Introduction',
        summary: 'SecureGen is an AI tool for identifying and fixing security vulnerabilities.',
        full: 'SecureGen is an AI-powered tool designed to assist developers in identifying, explaining, and automatically fixing security vulnerabilities within source code. The solution aims to integrate seamlessly into the developer workflow, improving code security from the earliest stages of the software development lifecycle.'
      },
      {
        title: 'Problem Statement',
        summary: 'Security is often overlooked in rapid development cycles.',
        full: 'With the rapid pace of software development, security often becomes an afterthought. Developers are not always trained in secure coding practices, and manual code reviews or security audits are resource-intensive. This leads to security flaws going unnoticed until they are exploited.'
      },
      {
        title: 'Objective',
        summary: 'Use AI to detect and fix code vulnerabilities.',
        full: 'The objective of SecureGen is to leverage Generative AI to detect, explain, and remediate code vulnerabilities across multiple programming languages, thus enhancing software security and reducing the burden on security teams.'
      },
      {
        title: 'Real-World Impact',
        summary: 'Helps deliver secure software faster and more reliably.',
        full: 'SecureGen helps organizations build secure software faster by empowering developers to identify and fix security flaws in real time. This reduces the cost of late-stage vulnerability detection, enhances regulatory compliance, and contributes to overall software reliability and trustworthiness.'
      }
    ];

    let html = '<ul class="list-group">';
    topics.forEach((item, index) => {
      html += `
        <li class="list-group-item">
          <strong>${item.title}:</strong>
          <span>${item.summary}</span>
          <span id="more-${index}" class="more-text"> ${item.full.replace(item.summary, '')}</span>
          <button class="read-more-btn" onclick="toggleMore(${index})">Read More</button>
        </li>
      `;
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  function toggleMore(index) {
    const moreText = document.getElementById(`more-${index}`);
    const btn = moreText.nextElementSibling;
    if (moreText.style.display === 'inline') {
      moreText.style.display = 'none';
      btn.textContent = 'Read More';
    } else {
      moreText.style.display = 'inline';
      btn.textContent = 'Read Less';
    }
  }