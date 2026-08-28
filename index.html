// ================================================
// MAIN.JS - FULL LUXURY UI INTEGRATION WITH MULTI-AGENT SUPPORT
// OFF-PLAN / LISTING GALLERY: ORIGINAL MOBILE UI + SMOOTH TRANSITIONS + SWIPE + IDEMPOTENT EVENTS
// COMMUNITY DETAIL PAGES WITH SPA ROUTING AND AUTO-FILTER ON PROPERTIES
// CLICK-TO-OPEN-DETAIL ON LISTING AND OFF-PLAN CARDS (like communities)
// SPACING ADJUSTED TO MATCH OFF-PLAN LISTING PAGE
// DYNAMIC AGENT PROFILE + RECENT SALES ADDED
// ================================================

// ================================================
// UPDATED: Home page counts all set to 3
// Featured Properties: 3, Featured Off-Plan: 3, Communities: 3
// ================================================

import { CONFIG } from './config.js';

// ============= PRELOADER =============

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    const image = document.getElementById('preloader-image');
    
    if (image) {
        image.classList.add('slide-up');
    }
    
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.remove();
                }
            }, 100);
        }
    }, 800);
}

// ============= STATE =============
let listings = [];
let offplan = [];
let communities = [];
let blogPosts = [];
let currentSection = 'home';
let config = { ...CONFIG };
let agentProfile = {};
let currentListingId = null;
let currentOffplanId = null;
let isRTL = false;
let currentBlogPost = null;

// Multi-agent state
let currentAgentSlug = null;
let currentAgentData = null;
const DEFAULT_AGENT_SLUG_KEY = 'ak_current_agent_slug';

// Recent Sales state (NEW)
let recentSales = [];
let agentsData = [];

// Gallery controllers for AbortController (to prevent duplicate events)
let galleryController = null;
let offplanGalleryController = null;

// ============= API BASE URL =============
const API_BASE = CONFIG.workerURL || 'https://ranabullah01.ranabullah01.workers.dev';

// ============= URL ROUTING =============
const BASE_PATH = (() => {
    if (location.hostname.endsWith('.github.io')) {
        const seg = location.pathname.split('/').filter(Boolean)[0];
        return seg ? '/' + seg : '';
    }
    return '';
})();

const KNOWN_SECTIONS = ['listings', 'offplan', 'communities', 'about', 'contact', 'valuation', 'goldenvisa', 'blog', 'community'];

function buildPath(sectionId, slug) {
    const parts = [];
    if (BASE_PATH) parts.push(BASE_PATH.replace(/^\//, ''));
    if (currentAgentSlug && sectionId !== 'home') {
        parts.push(currentAgentSlug);
    }
    if (sectionId && sectionId !== 'home') parts.push(sectionId);
    if (slug) parts.push(String(slug));
    const path = '/' + parts.join('/');
    return path.length > 1 ? path : '/';
}

function parseCurrentRoute() {
    let path = location.pathname;
    if (BASE_PATH && path.startsWith(BASE_PATH)) {
        path = path.slice(BASE_PATH.length);
    }
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return { section: 'home', slug: null, agentSlug: null };

    let agentSlug = null;
    let section = 'home';
    let slug = null;

    if (KNOWN_SECTIONS.includes(segments[0])) {
        section = segments[0];
        slug = segments[1] || null;
    } else {
        agentSlug = segments[0];
        if (segments.length > 1) {
            const next = segments[1];
            if (KNOWN_SECTIONS.includes(next)) {
                section = next;
                slug = segments[2] || null;
            }
        }
    }
    return { section, slug, agentSlug };
}

function updateCanonical(path) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', location.origin + path);
}

// ============= 404 HELPERS =============
function showNotFound(type) {
    const main = document.getElementById('main-content');
    if (main) {
        main.innerHTML = `
            <div style="text-align:center;padding:80px 20px;font-family:Inter, sans-serif;">
                <h1 style="font-family:Plus Jakarta Sans, sans-serif;font-size:3rem;color:#0B3B2E;">404 - ${type} Not Found</h1>
                <p style="font-size:1.2rem;color:#4A544F;">The ${type.toLowerCase()} you are looking for does not exist.</p>
                <a href="/${currentAgentSlug || ''}" style="display:inline-block;margin-top:20px;padding:14px 34px;background:#0B3B2E;color:#F7F3EA;border-radius:100px;text-decoration:none;font-weight:600;">Go Home</a>
            </div>
        `;
    }
}

// ============= TOAST NOTIFICATION =============
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return alert(message);
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fadeout');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============= NEW GALLERY MODAL =============
let galleryModalOpen = false;

function openGalleryModal(images, startIndex = 0) {
    if (!images || images.length === 0) {
        console.warn('openGalleryModal: no images provided');
        return;
    }
    if (galleryModalOpen) {
        console.warn('Gallery already open');
        return;
    }

    let imageList = Array.isArray(images) ? images : (typeof images === 'string' ? images.split(',').map(s => s.trim()).filter(s => s) : []);
    if (imageList.length === 0) {
        console.warn('openGalleryModal: empty image list after normalization');
        return;
    }

    const total = imageList.length;
    const isMobile = window.innerWidth < 768;

    const overlay = document.createElement('div');
    overlay.id = 'gallery-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.50);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #ffffff;
        border-radius: 20px;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 24px 80px rgba(0,0,0,0.3);
        overflow: hidden;
        position: relative;
        margin: 0 auto;
    `;
    if (isMobile) {
        modal.style.maxWidth = '100%';
        modal.style.margin = '0 10px';
        modal.style.borderRadius = '16px';
    }

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 20px;
        z-index: 10;
        background: none;
        border: none;
        font-size: 28px;
        line-height: 1;
        color: var(--emerald-deep, #072720);
        cursor: pointer;
        transition: transform 0.2s, color 0.2s;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 300;
    `;
    closeBtn.addEventListener('mouseenter', () => { closeBtn.style.transform = 'scale(1.2)'; });
    closeBtn.addEventListener('mouseleave', () => { closeBtn.style.transform = 'scale(1)'; });
    closeBtn.addEventListener('click', closeGalleryModal);

    const header = document.createElement('div');
    header.style.cssText = `
        padding: 20px 24px 16px 24px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 600;
        font-size: 18px;
        color: var(--emerald-deep, #072720);
        letter-spacing: -0.02em;
        border-bottom: 1px solid var(--line, #E4DDCC);
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.textContent = `All Photos (${total})`;
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: ${isMobile ? '12px 16px 20px' : '24px'};
        background: #ffffff;
    `;

    if (isMobile) {
        imageList.forEach((src) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.style.cssText = `
                margin-bottom: 12px;
                border-radius: 12px;
                overflow: hidden;
                background: #f8f6f2;
            `;
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Property image';
            img.style.cssText = `
                display: block;
                width: 100%;
                height: auto;
                border-radius: 12px;
            `;
            imgWrapper.appendChild(img);
            content.appendChild(imgWrapper);
        });
    } else {
        const desktopContent = document.createElement('div');
        desktopContent.style.cssText = `
            display: flex;
            flex-direction: row;
            gap: 24px;
            min-height: 0;
            height: 100%;
            align-items: stretch;
        `;

        const leftCol = document.createElement('div');
        leftCol.style.cssText = `
            flex: 2;
            position: relative;
            background: #f8f6f2;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            aspect-ratio: 4/3;
        `;

        const largeImg = document.createElement('img');
        largeImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: opacity 0.3s ease;
            background: #f8f6f2;
        `;
        largeImg.src = imageList[0];
        largeImg.alt = 'Gallery image';

        const counter = document.createElement('div');
        counter.style.cssText = `
            position: absolute;
            bottom: 16px;
            right: 20px;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(4px);
            color: var(--cream, #F7F3EA);
            padding: 4px 14px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.04em;
            pointer-events: none;
        `;
        counter.textContent = `1 / ${total}`;

        leftCol.appendChild(largeImg);
        leftCol.appendChild(counter);

        const rightCol = document.createElement('div');
        rightCol.style.cssText = `
            flex: 1.2;
            display: flex;
            flex-direction: column;
            min-width: 0;
            max-height: 100%;
            overflow-y: auto;
        `;

        const thumbGrid = document.createElement('div');
        thumbGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            flex: 1;
            align-content: start;
        `;

        const thumbnails = [];
        imageList.forEach((src, idx) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = `Thumbnail ${idx + 1}`;
            thumb.dataset.index = idx;
            thumb.style.cssText = `
                width: 100%;
                aspect-ratio: 1/1;
                object-fit: cover;
                border-radius: 8px;
                border: 3px solid transparent;
                cursor: pointer;
                transition: border 0.2s, transform 0.2s;
                background: #f8f6f2;
            `;
            if (idx === 0) {
                thumb.style.borderColor = 'var(--brass, #B08A3E)';
                thumb.style.transform = 'scale(1.02)';
            }
            thumb.addEventListener('click', () => {
                setGalleryImage(idx);
            });
            thumbGrid.appendChild(thumb);
            thumbnails.push(thumb);
        });

        rightCol.appendChild(thumbGrid);
        desktopContent.appendChild(leftCol);
        desktopContent.appendChild(rightCol);
        content.appendChild(desktopContent);

        function setGalleryImage(index) {
            if (index < 0 || index >= total) return;
            largeImg.style.opacity = '0';
            setTimeout(() => {
                largeImg.src = imageList[index];
                largeImg.alt = `Image ${index + 1}`;
                largeImg.style.opacity = '1';
            }, 150);
            counter.textContent = `${index + 1} / ${total}`;
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.style.borderColor = 'var(--brass, #B08A3E)';
                    thumb.style.transform = 'scale(1.02)';
                } else {
                    thumb.style.borderColor = 'transparent';
                    thumb.style.transform = 'scale(1)';
                }
            });
        }

        const keyHandlerDesktop = (e) => {
            if (e.key === 'ArrowLeft') {
                const currentSrc = largeImg.src;
                const currentIndex = imageList.indexOf(currentSrc);
                setGalleryImage(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                const currentSrc = largeImg.src;
                const currentIndex = imageList.indexOf(currentSrc);
                setGalleryImage(currentIndex + 1);
            }
        };
        document.addEventListener('keydown', keyHandlerDesktop);
        window._galleryDesktopCleanup = () => {
            document.removeEventListener('keydown', keyHandlerDesktop);
        };
    }

    modal.appendChild(header);
    modal.appendChild(content);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });

    galleryModalOpen = true;

    function closeGalleryModal() {
        if (!galleryModalOpen) return;
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            galleryModalOpen = false;
            if (window._galleryDesktopCleanup) {
                window._galleryDesktopCleanup();
                delete window._galleryDesktopCleanup;
            }
        }, 300);
    }

    const keyHandler = (e) => {
        if (e.key === 'Escape') closeGalleryModal();
    };
    document.addEventListener('keydown', keyHandler);

    const originalClose = closeGalleryModal;
    closeGalleryModal = function() {
        document.removeEventListener('keydown', keyHandler);
        originalClose();
    };
    closeBtn.onclick = closeGalleryModal;
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeGalleryModal();
    });
}

// ============= LOAD DATA FROM API =============

async function loadAllData() {
    const listingsContainer = document.getElementById('listings-grid');
    const featuredContainer = document.getElementById('featured-listings');
    if (listingsContainer) listingsContainer.innerHTML = createSkeletons(3);
    if (featuredContainer) featuredContainer.innerHTML = createSkeletons(3);

    const route = parseCurrentRoute();
    let slug = route.agentSlug;
    if (!slug) {
        slug = localStorage.getItem(DEFAULT_AGENT_SLUG_KEY);
    }
    if (!slug) {
        try {
            const resp = await fetch(`${API_BASE}/api/agents`);
            const data = await resp.json();
            if (data.success && data.agents && data.agents.length > 0) {
                slug = data.agents[0].slug;
            }
        } catch (e) {
            console.warn('Could not fetch default agent, using hardcoded');
            slug = 'ahmed-khan';
        }
    }
    currentAgentSlug = slug;
    localStorage.setItem(DEFAULT_AGENT_SLUG_KEY, slug);

    try {
        const agentResp = await fetch(`${API_BASE}/api/agents/${slug}`);
        const agentData = await agentResp.json();
        if (agentData.success) {
            currentAgentData = agentData.agent;
            Object.assign(config, currentAgentData);
        } else {
            show404();
            return;
        }
    } catch (e) {
        console.error('Failed to load agent:', e);
        show404();
        return;
    }

    // Load agents list for About page
    try {
        const agentsResp = await fetch(`${API_BASE}/api/agents`);
        const agentsDataJson = await agentsResp.json();
        if (agentsDataJson.success) {
            agentsData = agentsDataJson.agents || [];
        }
    } catch (e) {
        console.error('Failed to load agents list:', e);
    }

    // Load recent sales
    try {
        const salesResp = await fetch(`${API_BASE}/api/recent-sales?t=${Date.now()}`);
        const salesDataJson = await salesResp.json();
        if (salesDataJson.success) {
            recentSales = salesDataJson.sales || [];
        }
    } catch (e) {
        console.error('Failed to load recent sales:', e);
        recentSales = [];
    }

    try {
        const profileResponse = await fetch(`${API_BASE}/api/agent-profile?t=${Date.now()}`);
        const profileData = await profileResponse.json();
        if (profileData.success) {
            agentProfile = profileData.profile;
            Object.assign(config, agentProfile);
        }
    } catch (e) { /* ignore */ }

    try {
        const listingsResponse = await fetch(`${API_BASE}/api/listings?t=${Date.now()}`);
        const listingsData = await listingsResponse.json();
        if (listingsData.success) {
            listings = listingsData.listings;
        }
    } catch (e) { console.error('Error loading listings:', e); }

    try {
        const offplanResponse = await fetch(`${API_BASE}/api/offplan?t=${Date.now()}`);
        const offplanData = await offplanResponse.json();
        if (offplanData.success) {
            offplan = offplanData.projects;
        }
    } catch (e) { console.error('Error loading offplan:', e); }

    try {
        const communitiesResponse = await fetch(`${API_BASE}/api/communities?t=${Date.now()}`);
        const communitiesData = await communitiesResponse.json();
        if (communitiesData.success) {
            communities = communitiesData.communities;
        } else {
            console.error('Communities API error:', communitiesData.message);
        }
    } catch (e) {
        console.error('Error loading communities:', e);
    }

    try {
        const blogResponse = await fetch(`${API_BASE}/api/blog?t=${Date.now()}`);
        const blogData = await blogResponse.json();
        if (blogData.success) {
            blogPosts = blogData.posts;
        }
    } catch (e) { console.error('Error loading blog:', e); }

    updateAllSections();
    applyCommunityFilterFromURL();
}

function loadFromLocalStorage() {
    try {
        listings = JSON.parse(localStorage.getItem('ak_listings') || '[]');
        offplan = JSON.parse(localStorage.getItem('ak_offplan') || '[]');
        communities = JSON.parse(localStorage.getItem('ak_communities') || '[]');
        blogPosts = JSON.parse(localStorage.getItem('ak_blog') || '[]');
        Object.assign(config, JSON.parse(localStorage.getItem('ak_config') || '{}'));
        updateAllSections();
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
}

function show404() {
    document.body.innerHTML = `
        <div style="text-align:center;padding:80px 20px;font-family:Inter, sans-serif;">
            <h1 style="font-family:Plus Jakarta Sans, sans-serif;font-size:3rem;color:#0B3B2E;">404 - Agent Not Found</h1>
            <p style="font-size:1.2rem;color:#4A544F;">The agent you are looking for does not exist.</p>
            <a href="/" style="display:inline-block;margin-top:20px;padding:14px 34px;background:#0B3B2E;color:#F7F3EA;border-radius:100px;text-decoration:none;font-weight:600;">Go Home</a>
        </div>
    `;
}

function createSkeletons(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line long"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line" style="width: 80%; margin-bottom: 0;"></div>
                </div>
            </div>
        `;
    }
    return html;
}

// ============= UPDATE ALL SECTIONS =============

function updateAllSections() {
    updateConfigInDOM();
    renderFeaturedListings();
    renderFeaturedOffplan();
    renderHomeCommunities();
    renderListingsPage();
    renderOffplanPage();
    renderCommunitiesPage();
    renderAboutPage();
    renderBlogGrid();
    populateCommunityFilter();
    
    const { section, slug } = parseCurrentRoute();
    const filterBar = document.getElementById('filter-bar');
    if (section === 'listings' && slug) {
        const listing = listings.find(l => l.id == slug || String(l.id) === String(slug));
        if (listing) {
            document.getElementById('listings-grid').style.display = 'none';
            document.getElementById('listing-detail').style.display = 'block';
            document.getElementById('listing-detail-content').innerHTML = renderListingDetail(listing);
            document.title = listing.title + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
            if (filterBar) filterBar.style.display = 'none';
            setTimeout(initGallery, 100);
        }
    } else if (section === 'listings') {
        if (filterBar) filterBar.style.display = 'grid';
    }

    if (section === 'community' && slug) {
        const community = communities.find(c => c.slug === slug || String(c.id) === String(slug));
        if (community) {
            document.getElementById('communities-grid').style.display = 'none';
            document.getElementById('community-detail').style.display = 'block';
            const detailContent = document.getElementById('community-detail-content');
            detailContent.innerHTML = renderCommunityDetail(community);
            const backButton = detailContent.querySelector('.community-detail-back-button');
            if (backButton) {
                backButton.addEventListener('click', () => window.showCommunityList({ push: true }));
            }
            document.title = community.name + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
        }
    }

    document.querySelectorAll('input[name="agentSlug"]').forEach(inp => {
        inp.value = currentAgentSlug || '';
    });
}

// ============= CONFIG FUNCTIONS =============

function updateConfigInDOM() {
    const agent = currentAgentData || agentProfile || config;
    
    document.querySelectorAll('#agent-name-home, #agent-name-about').forEach(el => {
        if (el) el.textContent = agent.agentName || config.agentName || 'Ahmed Khan';
    });
    
    const titleEl = document.getElementById('agent-tagline');
    if (titleEl && !titleEl.dataset.custom) {
        titleEl.textContent = agent.agentTitle || config.agentTitle || 'Luxury Real Estate Specialist';
    }
    
    document.querySelectorAll('#rerna-number, #rerna-number-about, #footer-rerna').forEach(el => {
        if (el) el.textContent = agent.reraBRN || config.rernaBRN || '123456';
    });
    
    document.querySelectorAll('#agent-bio-home, #agent-full-bio').forEach(el => {
        if (el) el.textContent = agent.bio || config.bio || '';
    });
    
    const statIds = ['years-exp', 'properties-sold', 'happy-clients', 'years-exp-about', 'properties-sold-about', 'happy-clients-about'];
    statIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id.includes('years')) el.textContent = agent.yearsExperience || agent.experience || config.experience || '12';
            else if (id.includes('properties')) el.textContent = agent.propertiesSold || '850';
            else if (id.includes('happy')) el.textContent = '1200';
        }
    });
    
    const specialtiesList = document.getElementById('specialties-list');
    if (specialtiesList) {
        specialtiesList.innerHTML = '';
        (agent.specialties || config.specialties || '').split(',').forEach(s => {
            if (s.trim()) {
                const tag = document.createElement('span');
                tag.className = 'specialty-tag';
                tag.textContent = s.trim();
                specialtiesList.appendChild(tag);
            }
        });
    }
    
    const languagesList = document.getElementById('languages-list');
    if (languagesList) {
        languagesList.innerHTML = '';
        (agent.languages || config.languages || '').split(',').forEach(l => {
            if (l.trim()) {
                const tag = document.createElement('span');
                tag.className = 'language-tag';
                tag.textContent = l.trim();
                languagesList.appendChild(tag);
            }
        });
    }
    
    const photo = agent.photo || config.photo || 'https://placehold.co/400x400/0A1628/C9A84C?text=Agent';
    document.querySelectorAll('#agent-photo-home, #agent-photo-about').forEach(el => {
        if (el) el.src = photo;
    });
    
    const address = agent.address || config.address || 'Dubai, UAE';
    const phone = agent.phone || config.phone || '+971501234567';
    const email = agent.email || config.email || 'info@agentwebstudio.com';
    const whatsapp = agent.whatsapp || config.whatsapp || '+971501234567';
    
    document.getElementById('office-address').textContent = address;
    document.getElementById('office-phone').textContent = phone;
    document.getElementById('office-email').textContent = email;
    document.getElementById('office-whatsapp').textContent = whatsapp;
    document.getElementById('footer-address').textContent = address;
    document.getElementById('footer-phone').textContent = phone;
    document.getElementById('footer-email').textContent = email;
    document.getElementById('footer-whatsapp').href = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    
    document.querySelectorAll('.portal-btn.propertyfinder').forEach(el => el.href = agent.propertyFinderURL || config.propertyFinderURL || '#');
    document.querySelectorAll('.portal-btn.bayut').forEach(el => el.href = agent.bayutURL || config.bayutURL || '#');
    
    const social = agent.social || config.social || {};
    const socialKeys = ['facebook', 'instagram', 'linkedin', 'youtube'];
    document.querySelectorAll('.social-links a').forEach((link, index) => {
        if (index < socialKeys.length) {
            const key = socialKeys[index];
            link.href = social[key] || config.social?.[key] || '#';
        }
    });
    
    const greeting = agent.whatsappGreeting || config.whatsappGreeting || 'Hello! I\'m interested in your real estate services.';
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
    
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        if (link.href) {
            link.href = link.href.replace(/wa\.me\/\d+/, `wa.me/${cleanNumber}`);
            if (link.href.includes('text=')) {
               link.href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
            }
        }
    });
    
    const floatBtn = document.querySelector('.float-whatsapp');
    if (floatBtn) {
        floatBtn.href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
    }
    
    document.title = agent.siteName || config.siteName || 'Agent Web Studio - Luxury Real Estate Dubai';
    
    const logoLinks = document.querySelectorAll('.logo a, .mobile-logo a, .floating-logo a');
    logoLinks.forEach(link => {
        if (currentAgentSlug) {
            link.href = '/' + currentAgentSlug;
        } else {
            link.href = '/';
        }
    });

    document.querySelectorAll('input[name="agentSlug"]').forEach(inp => {
        inp.value = currentAgentSlug || '';
    });

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && agent.siteDescription) {
        metaDesc.content = agent.siteDescription;
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && agent.siteName) {
        ogTitle.content = agent.siteName;
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && agent.siteDescription) {
        ogDesc.content = agent.siteDescription;
    }
}

// ============= RENDER FUNCTIONS =============

function renderFeaturedListings() {
    const container = document.getElementById('featured-listings');
    if (!container) return;
    
    const featured = listings.filter(l => l.featured).slice(0, 3); // stays 3
    container.innerHTML = '';
    
    if (featured.length === 0) {
        container.innerHTML = '<p class="no-results">No featured properties found.</p>';
        return;
    }
    
    featured.forEach(listing => {
        container.appendChild(createListingCard(listing));
    });
}

function renderListingsPage() {
    const container = document.getElementById('listings-grid');
    if (!container) return;
    renderListings(listings, container);
}

function renderListings(listingsData, container) {
    container.innerHTML = '';
    
    if (listingsData.length === 0) {
        container.innerHTML = '<p class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--dark-grey);">No properties found matching your criteria.</p>';
        return;
    }
    
    listingsData.forEach(listing => {
        container.appendChild(createListingCard(listing));
    });
}

function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.setAttribute('data-listing-id', listing.id);
    
    const images = listing.images && typeof listing.images === 'string' 
        ? listing.images.split(',') 
        : (Array.isArray(listing.images) ? listing.images : []);
    const firstImage = images.length > 0 ? images[0] : 'https://placehold.co/800x600/0A1628/C9A84C?text=Property';
    
    card.innerHTML = `
        <div class="listing-card-image">
            <img src="${firstImage}" alt="${listing.title}" loading="lazy">
            <div class="listing-card-badges">
                ${listing.featured ? '<span class="badge badge-featured"><i class="fas fa-star"></i> FEATURED</span>' : ''}
                <span class="badge badge-status">${listing.status.replace('-', ' ')}</span>
                <span class="badge badge-type">${listing.type}</span>
            </div>
        </div>
        <div class="listing-card-body">
            <h3>${listing.title}</h3>
            <div class="listing-card-price">AED ${formatPrice(listing.price)}</div>
            <div class="listing-card-details">
                <span><i class="fas fa-map-marker-alt"></i> ${listing.community}</span>
                <span><i class="fas fa-bed"></i> ${listing.bedrooms} bed</span>
                <span><i class="fas fa-bath"></i> ${listing.bathrooms} bath</span>
                <span><i class="fas fa-ruler-combined"></i> ${listing.sqft} sqft</span>
            </div>
            <div class="listing-card-actions">
                <button class="btn btn-secondary btn-sm view-detail-btn">View Details</button>
                <a href="https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(listing.whatsappText || 'I\'m interested in this property')}" target="_blank" class="btn btn-whatsapp btn-sm"><i class="fab fa-whatsapp"></i> WhatsApp</a>
            </div>
        </div>
    `;

    card.addEventListener('click', function(e) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        window.viewListingPage(listing.id);
    });

    const detailBtn = card.querySelector('.view-detail-btn');
    if (detailBtn) {
        detailBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.viewListingPage(listing.id);
        });
    }

    return card;
}

function getWhatsAppNumber() {
    const number = currentAgentData?.whatsapp || config.whatsapp || '+971501234567';
    return number.replace(/[^0-9]/g, '');
}

// ============= VIEW LISTING DETAIL =============

window.viewListingPage = function(id, opts = {}) {
    const { push = true } = opts;
    const listing = listings.find(l => l.id == id || String(l.id) === String(id));
    if (!listing) {
        showToast('Listing not found.', 'error');
        return;
    }

    const grid = document.getElementById('listings-grid');
    const detailContainer = document.getElementById('listing-detail');
    const content = document.getElementById('listing-detail-content');
    const filterBar = document.getElementById('filter-bar');
    
    if (grid) grid.style.display = 'none';
    if (filterBar) filterBar.style.display = 'none';
    if (detailContainer) {
        detailContainer.style.display = 'block';
        if (content) {
            content.innerHTML = renderListingDetail(listing);
            setTimeout(initGallery, 100);
        }
    }

    if (push) {
        const path = buildPath('listings', listing.id);
        if (location.pathname !== path) {
            history.pushState({ section: 'listings', slug: listing.id }, '', path);
        }
        updateCanonical(path);
    }
    
    document.title = listing.title + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
    
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    const listingsSection = document.getElementById('listings');
    if (listingsSection) listingsSection.classList.add('active');
    
    document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
        el.classList.remove('active');
        if (el.dataset && el.dataset.section === 'listings') {
            el.classList.add('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showListingList = function(opts = {}) {
    const { push = true } = opts;
    const grid = document.getElementById('listings-grid');
    const detail = document.getElementById('listing-detail');
    const content = document.getElementById('listing-detail-content');
    const filterBar = document.getElementById('filter-bar');
    
    if (grid) grid.style.display = 'grid';
    if (filterBar) filterBar.style.display = 'grid';
    if (detail) detail.style.display = 'none';
    if (content) content.innerHTML = '';
    
    if (push) {
        const path = buildPath('listings');
        if (location.pathname !== path) {
            history.pushState({ section: 'listings', slug: null }, '', path);
        }
        updateCanonical(path);
    }
    document.title = 'Properties | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
    
    navigateTo('listings', { push: false });
};

// ============================================================
// RENDER LISTING DETAIL  (UPDATED GALLERY – MATCHES OFF-PLAN)
// ============================================================

function renderListingDetail(listing) {
    const images = listing.images && typeof listing.images === 'string'
        ? listing.images.split(',').map(img => img.trim()).filter(img => img)
        : (Array.isArray(listing.images) ? listing.images : []);

    if (images.length === 0) {
        images.push('https://placehold.co/1200x675/0A1628/C9A84C?text=No+Image');
    }

    window.galleryImages = images;

    // --- NEW: limited thumbnails + "+N Photos" tile, same as off-plan ---
    const isDesktop = window.innerWidth >= 768;
    const visibleCount = isDesktop ? 4 : 3;
    const visibleThumbs = images.slice(0, visibleCount);
    const remainingCount = Math.max(0, images.length - visibleCount);

    let thumbsHtml = visibleThumbs.map((img, index) => `
        <img src="${img}" alt="${listing.title} - Image ${index + 1}"
             class="thumb ${index === 0 ? 'active' : ''}"
             data-index="${index}"
             style="cursor:pointer;"
             onerror="this.src='https://placehold.co/100x100/0A1628/C9A84C?text=No+Image'">
    `).join('');

    if (remainingCount > 0) {
        thumbsHtml += `
            <div class="thumb more-photos" onclick="window.openGalleryModal(window.galleryImages, ${visibleCount})">
                <span>+${remainingCount} Photos</span>
            </div>
        `;
    }
    // --- end of new gallery thumb generation ---

    const features = listing.features && typeof listing.features === 'string'
        ? listing.features.split(',').map(f => f.trim()).filter(f => f)
        : (Array.isArray(listing.features) ? listing.features : []);

    const statusClass = listing.status || 'for-sale';
    const statusLabel = listing.status ? listing.status.replace('-', ' ').toUpperCase() : 'FOR SALE';

    const gallery = `
        <div class="listing-detail-gallery" id="listing-gallery">
            <div class="gallery-main" id="gallery-main">
                <img src="${images[0]}" alt="${listing.title}" id="gallery-main-image" 
                     style="cursor:default;" onerror="this.src='https://placehold.co/1200x675/0A1628/C9A84C?text=No+Image'">
                <div class="gallery-controls">
                    <button class="prev-btn" id="gallery-prev" aria-label="Previous image">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="next-btn" id="gallery-next" aria-label="Next image">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="gallery-counter" id="gallery-counter">1 / ${images.length}</div>
            </div>
            <div class="gallery-thumbs" id="gallery-thumbs">
                ${thumbsHtml}
            </div>
        </div>
    `;

    const details = [
        { label: 'Property Type', value: listing.type || 'N/A' },
        { label: 'Status', value: statusLabel },
        { label: 'Community', value: listing.community || 'N/A' },
        { label: 'Bedrooms', value: listing.bedrooms || 'N/A' },
        { label: 'Bathrooms', value: listing.bathrooms || 'N/A' },
        { label: 'Size', value: listing.sqft ? `${listing.sqft} sqft` : 'N/A' },
        { label: 'Floor', value: listing.floor || 'N/A' },
        { label: 'View', value: listing.view || 'N/A' },
        { label: 'Furnishing', value: listing.furnishing || 'N/A' },
        { label: 'Parking', value: listing.parking || 'N/A' }
    ];
    if (listing.permit) details.push({ label: 'Trakheesi Permit', value: listing.permit });
    if (listing.building) details.push({ label: 'Building', value: listing.building });

    const propertyDetailsHtml = `
        <div class="listing-detail-card property-details-card">
            <h3 class="listing-detail-card-title">Property Details</h3>
            <div class="listing-detail-details-grid">
                ${details.map(d => `
                    <div class="listing-detail-detail-item">
                        <span class="detail-label">${d.label}</span>
                        <span class="detail-value">${d.value}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const quickStats = `
        <div class="quick-stats-card">
            <div class="quick-stat-block">
                <i class="fas fa-bed"></i>
                <span class="stat-value">${listing.bedrooms || 'N/A'}</span>
                <span class="stat-label">Beds</span>
            </div>
            <div class="quick-stat-block">
                <i class="fas fa-bath"></i>
                <span class="stat-value">${listing.bathrooms || 'N/A'}</span>
                <span class="stat-label">Baths</span>
            </div>
            <div class="quick-stat-block">
                <i class="fas fa-ruler-combined"></i>
                <span class="stat-value">${listing.sqft || 'N/A'}</span>
                <span class="stat-label">sqft</span>
            </div>
            <div class="quick-stat-block">
                <i class="fas fa-building"></i>
                <span class="stat-value">${listing.type || 'N/A'}</span>
                <span class="stat-label">Type</span>
            </div>
        </div>
    `;

    const whatsappNumber = getWhatsAppNumber();
    const whatsappText = listing.whatsappText || "I'm interested in this property";

    const ctaHtml = `
        <div class="listing-detail-actions-card">
            <h4 class="action-title">Interested in this property?</h4>
            <p class="action-subtitle">Get more details or schedule a viewing</p>
            <div class="listing-detail-actions">
                <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}" target="_blank" class="btn btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> Inquire on WhatsApp
                </a>
                <button class="btn btn-primary" onclick="window.scheduleViewing('${listing.title}')">
                    <i class="fas fa-calendar-check"></i> Schedule Viewing
                </button>
            </div>
        </div>
    `;

    return `
        <div class="listing-detail-page">
            <div class="listing-detail-top-bar">
                <button class="btn btn-secondary" onclick="window.showListingList()">
                    <i class="fas fa-arrow-left"></i> <i class="fas fa-building" style="margin-right:6px;"></i> BACK TO PROPERTIES
                </button>
                <div class="breadcrumb-nav">
                    <a href="#" onclick="window.showListingList(); return false;">Home</a>
                    <span class="separator">/</span>
                    <a href="#" onclick="window.showListingList(); return false;"><i class="fas fa-building" style="margin-right:4px;"></i>Properties</a>
                    <span class="separator">/</span>
                    <span class="current">${listing.community || 'Community'}</span>
                    <span class="separator">/</span>
                    <span class="current">${listing.title}</span>
                </div>
            </div>

            <div class="listing-detail-container">
                <div class="listing-detail-left-col">
                    ${gallery}
                    <div class="desktop-specs">${propertyDetailsHtml}</div>
                </div>

                <div class="listing-detail-right-col">
                    <h1 class="listing-detail-title">${listing.title}</h1>

                    <div class="price-status-row">
                        <span class="listing-detail-price">AED ${formatPrice(listing.price)}</span>
                        <span class="status-pill ${statusClass}">${statusLabel}</span>
                    </div>

                    <div class="listing-detail-location">
                        <i class="fas fa-map-marker-alt"></i> ${listing.community || 'Dubai, UAE'}
                    </div>

                    ${quickStats}

                    ${listing.description ? `
                        <div class="listing-detail-card">
                            <h3 class="listing-detail-card-title">Description</h3>
                            <p class="listing-detail-description">${listing.description}</p>
                        </div>
                    ` : ''}

                    ${features.length > 0 ? `
                        <div class="listing-detail-card">
                            <h3 class="listing-detail-card-title">Features & Amenities</h3>
                            <div class="listing-detail-features-grid">
                                ${features.map(f => `
                                    <span class="listing-detail-feature-item">
                                        <i class="fas fa-check-circle"></i> ${f}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="mobile-specs">${propertyDetailsHtml}</div>

                    ${ctaHtml}
                </div>
            </div>

            <div class="trust-badges-full">
                <div class="trust-badges-inner">
                    <div class="trust-item">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>Secure Investment</strong>
                            <span>RERA approved property with freehold ownership</span>
                        </div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <strong>High ROI Potential</strong>
                            <span>Premium location with strong rental demand</span>
                        </div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-headset"></i>
                        <div>
                            <strong>Full Support</strong>
                            <span>From purchase to property management</span>
                        </div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-hand-holding-usd"></i>
                        <div>
                            <strong>Flexible Payment</strong>
                            <span>Multiple payment options available</span>
                        </div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-percent"></i>
                        <div>
                            <strong>No Commission</strong>
                            <span>Direct from developer or owner</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============= GALLERY IMAGE SLIDER FUNCTIONS =============

let currentImageIndex = 0;
let galleryImages = [];

function transitionMainGalleryImage(mainImg, src, alt) {
    const requestId = String((Number(mainImg.dataset.imageRequestId) || 0) + 1);
    mainImg.dataset.imageRequestId = requestId;

    mainImg.style.transition = '';
    mainImg.style.transform = 'scale(1)';
    mainImg.style.transformOrigin = 'center center';

    const incomingImage = new Image();
    const showIncomingImage = () => {
        if (mainImg.dataset.imageRequestId !== requestId || !mainImg.isConnected) return;

        mainImg.src = src;
        mainImg.alt = alt;
        mainImg.classList.remove('gallery-image-transition');
        void mainImg.offsetWidth;
        mainImg.classList.add('gallery-image-transition');
        setTimeout(() => mainImg.classList.remove('gallery-image-transition'), 400);
    };
    incomingImage.onload = showIncomingImage;
    incomingImage.onerror = showIncomingImage;
    incomingImage.src = src;
}

window.setGalleryImage = function(index) {
    const images = galleryImages;
    if (!images || images.length === 0) return;
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    const mainImg = document.getElementById('gallery-main-image');
    if (!mainImg) return;
    currentImageIndex = index;
    const counter = document.getElementById('gallery-counter');
    if (counter) {
        counter.textContent = `${index + 1} / ${images.length}`;
    }
    document.querySelectorAll('.gallery-thumbs .thumb:not(.more-photos)').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    transitionMainGalleryImage(mainImg, images[index], `Image ${index + 1}`);
};

window.prevImage = function() {
    window.setGalleryImage(currentImageIndex - 1);
};

window.nextImage = function() {
    window.setGalleryImage(currentImageIndex + 1);
};

// ============= HOVER ZOOM (Desktop only) =============
function initHoverZoom(containerId, imageId) {
    if (window.innerWidth < 1024) return;

    const container = document.getElementById(containerId);
    const image = document.getElementById(imageId);
    if (!container || !image) return;

    if (container._zoomController) {
        container._zoomController.abort();
        delete container._zoomController;
    }

    const controller = new AbortController();
    container._zoomController = controller;
    const signal = controller.signal;

    let isZooming = false;

    function isOverImage(e) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        return target === image;
    }

    function updateZoom(e) {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const clampedX = Math.min(Math.max(x, 0), 1);
        const clampedY = Math.min(Math.max(y, 0), 1);
        image.style.transformOrigin = `${clampedX * 100}% ${clampedY * 100}%`;
        image.style.transform = 'scale(2.5)';
    }

    function startZoom(e) {
        if (e.target.closest('#gallery-modal-overlay') || !isOverImage(e)) return;
        isZooming = true;
        image.style.transition = 'transform 0.2s ease, transform-origin 0s ease';
        updateZoom(e);
    }

    function moveZoom(e) {
        if (!isZooming) return;
        if (e.target.closest('#gallery-modal-overlay') || !isOverImage(e)) {
            endZoom();
            return;
        }
        updateZoom(e);
    }

    function endZoom(e) {
        if (!isZooming) return;
        isZooming = false;
        image.style.transition = 'transform 0.25s ease';
        image.style.transform = 'scale(1)';
        setTimeout(() => {
            image.style.transformOrigin = 'center center';
        }, 250);
    }

    container.addEventListener('mouseenter', startZoom, { signal });
    container.addEventListener('mousemove', moveZoom, { signal });
    container.addEventListener('mouseleave', endZoom, { signal });
}

function initGallery() {
    if (window.galleryImages && window.galleryImages.length > 0) {
        galleryImages = window.galleryImages;
    } else {
        const thumbs = document.querySelectorAll('.gallery-thumbs .thumb:not(.more-photos)');
        if (thumbs.length > 0) {
            galleryImages = Array.from(thumbs).map(thumb => thumb.src);
        } else {
            const mainImg = document.getElementById('gallery-main-image');
            if (mainImg) {
                galleryImages = [mainImg.src];
            }
        }
    }
    
    currentImageIndex = 0;
    
    const counter = document.getElementById('gallery-counter');
    if (counter && galleryImages.length > 0) {
        counter.textContent = `1 / ${galleryImages.length}`;
    }

    if (galleryController) {
        galleryController.abort();
    }
    galleryController = new AbortController();
    const signal = galleryController.signal;
    
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const mainImg = document.getElementById('gallery-main-image');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', window.prevImage, { signal });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', window.nextImage, { signal });
    }

    document.querySelectorAll('.gallery-thumbs .thumb:not(.more-photos)').forEach((thumb) => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (!isNaN(index)) {
                window.setGalleryImage(index);
            }
        }, { signal });
    });
    
    const mainContainer = document.querySelector('#gallery-main');
    if (mainContainer) {
        let startX = 0, startY = 0;
        const touchStartHandler = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };
        const touchEndHandler = (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    window.prevImage();
                } else {
                    window.nextImage();
                }
            }
        };
        mainContainer.addEventListener('touchstart', touchStartHandler, { signal, passive: true });
        mainContainer.addEventListener('touchend', touchEndHandler, { signal, passive: true });
    }

    initHoverZoom('gallery-main', 'gallery-main-image');
}

// ============= OFF-PLAN FUNCTIONS (with multiple images) =============

function renderFeaturedOffplan() {
    const container = document.getElementById('featured-offplan');
    if (!container) return;
    
    const featured = offplan.filter(p => p.featured).slice(0, 3); // <-- CHANGED: was 2, now 3
    container.innerHTML = '';
    
    if (featured.length === 0) {
        container.innerHTML = '<p class="no-results">No featured off-plan projects found.</p>';
        return;
    }
    
    featured.forEach(project => {
        container.appendChild(createOffplanCard(project));
    });
}

function renderOffplanPage() {
    const container = document.getElementById('offplan-grid');
    if (!container) return;
    
    document.getElementById('offplan-detail').style.display = 'none';
    container.style.display = 'grid';
    
    container.innerHTML = '';
    if (offplan.length === 0) {
        container.innerHTML = '<p class="no-results">No off-plan projects found.</p>';
        return;
    }
    offplan.forEach(project => {
        container.appendChild(createOffplanCard(project));
    });
}

function createOffplanCard(project) {
    const card = document.createElement('div');
    card.className = 'offplan-card';
    card.setAttribute('data-offplan-id', project.id);
    
    let imageUrl = 'https://placehold.co/800x600/0A1628/C9A84C?text=Off-Plan';
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
        imageUrl = project.images[0];
    } else if (project.image) {
        imageUrl = project.image;
    }
    
    const types = project.types && typeof project.types === 'string' 
        ? project.types.split(',') 
        : (Array.isArray(project.types) ? project.types : []);
    
    card.innerHTML = `
        <div class="offplan-card-image">
            <img src="${imageUrl}" alt="${project.projectName}" loading="lazy">
        </div>
        <div class="offplan-card-body">
            <h3>${project.projectName}</h3>
            <div class="offplan-card-developer">${project.developer}</div>
            <div class="offplan-card-price">From AED ${formatPrice(project.startingPrice)}</div>
            <div class="offplan-card-details">
                ${project.community} | ${project.handoverDate} | ${types.join(', ')}
                ${project.goldenVisaEligible ? ' | 🏆 Golden Visa' : ''}
            </div>
            <div class="offplan-card-actions">
                <button class="btn btn-secondary btn-sm view-detail-btn">View Details</button>
                <a href="https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(project.brochureWhatsApp || 'I\'m interested in this off-plan project')}" target="_blank" class="btn btn-whatsapp btn-sm"><i class="fab fa-whatsapp"></i> Request Brochure</a>
            </div>
        </div>
    `;

    card.addEventListener('click', function(e) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        window.viewOffplanPage(project.id);
    });

    const detailBtn = card.querySelector('.view-detail-btn');
    if (detailBtn) {
        detailBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.viewOffplanPage(project.id);
        });
    }

    return card;
}

window.showOffplanList = function(opts = {}) {
    const { push = true } = opts;
    const grid = document.getElementById('offplan-grid');
    const detail = document.getElementById('offplan-detail');
    const content = document.getElementById('offplan-detail-content');
    if (grid) grid.style.display = 'grid';
    if (detail) detail.style.display = 'none';
    if (content) content.innerHTML = '';
    if (push) {
        const path = buildPath('offplan');
        if (location.pathname !== path) {
            history.pushState({ section: 'offplan', slug: null }, '', path);
        }
        updateCanonical(path);
    }
    document.title = 'Off-Plan Projects | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
    navigateTo('offplan', { push: false });
};

window.viewOffplanPage = function(id, opts = {}) {
    const { push = true } = opts;
    const project = offplan.find(p => p.id == id || String(p.id) === String(id));
    if (!project) {
        showToast('Project not found.', 'error');
        return;
    }
    currentOffplanId = id;

    const grid = document.getElementById('offplan-grid');
    const detailContainer = document.getElementById('offplan-detail');
    const content = document.getElementById('offplan-detail-content');
    if (grid) grid.style.display = 'none';
    if (detailContainer) {
        detailContainer.style.display = 'block';
        if (content) {
            content.innerHTML = renderOffplanDetail(project);
            setTimeout(initOffplanGallery, 100);
        }
    }

    if (push) {
        const slug = project.slug || project.id;
        const path = buildPath('offplan', slug);
        if (location.pathname !== path) {
            history.pushState({ section: 'offplan', slug: slug }, '', path);
        }
        updateCanonical(path);
    }
    document.title = project.projectName + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
    
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    const offplanSection = document.getElementById('offplan');
    if (offplanSection) offplanSection.classList.add('active');
    document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
        el.classList.remove('active');
        if (el.dataset && el.dataset.section === 'offplan') {
            el.classList.add('active');
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============================================================
// RENDER OFFPLAN DETAIL
// ============================================================

function renderOffplanDetail(project) {
    let images = [];
    if (project.images) {
        if (Array.isArray(project.images)) {
            images = project.images;
        } else if (typeof project.images === 'string') {
            images = project.images.split(',').map(s => s.trim()).filter(s => s);
        }
    }
    if (images.length === 0 && project.image) {
        images = [project.image];
    }
    if (images.length === 0) {
        images = ['https://placehold.co/1200x675/0A1628/C9A84C?text=Off-Plan'];
    }

    window.offplanGalleryImages = images;

    const isDesktop = window.innerWidth >= 768;
    const visibleCount = isDesktop ? 4 : 3;
    const visibleThumbs = images.slice(0, visibleCount);
    const remainingCount = Math.max(0, images.length - visibleCount);

    let thumbsHtml = visibleThumbs.map((img, index) => `
        <img src="${img}" alt="${project.projectName} - Image ${index + 1}"
             class="thumb ${index === 0 ? 'active' : ''}"
             data-index="${index}"
             style="cursor:pointer;"
             onerror="this.src='https://placehold.co/100x100/0A1628/C9A84C?text=No+Image'">
    `).join('');

    if (remainingCount > 0) {
        thumbsHtml += `
            <div class="thumb more-photos" onclick="window.openGalleryModal(window.offplanGalleryImages, ${visibleCount})">
                <span>+${remainingCount} Photos</span>
            </div>
        `;
    }

    const gallery = `
        <div class="listing-detail-gallery" id="offplan-gallery">
            <div class="gallery-main" id="offplan-gallery-main">
                <img src="${images[0]}" alt="${project.projectName}" id="offplan-gallery-main-image" 
                     style="cursor:default;" onerror="this.src='https://placehold.co/1200x675/0A1628/C9A84C?text=No+Image'">
                <div class="gallery-controls">
                    <button class="prev-btn" id="offplan-gallery-prev" aria-label="Previous image">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="next-btn" id="offplan-gallery-next" aria-label="Next image">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="gallery-counter" id="offplan-gallery-counter">1 / ${images.length}</div>
            </div>
            <div class="gallery-thumbs" id="offplan-gallery-thumbs">
                ${thumbsHtml}
            </div>
        </div>
    `;

    const hasHighlights = project.highlights && project.highlights.length > 0;
    const hasTypes = project.types && project.types.length > 0;
    const paymentPlan = project.paymentPlan || {};

    return `
        <div class="listing-detail-page">
            <div class="listing-detail-top-bar">
                <button class="btn btn-secondary" onclick="window.showOffplanList()">
                    <i class="fas fa-arrow-left"></i> BACK TO OFF-PLAN
                </button>
                <div class="breadcrumb-nav">
                    <a href="#" onclick="window.showOffplanList(); return false;">Home</a>
                    <span class="separator">/</span>
                    <a href="#" onclick="window.showOffplanList(); return false;">Off-Plan</a>
                    <span class="separator">/</span>
                    <span class="current">${project.projectName}</span>
                </div>
            </div>

            <div class="listing-detail-container">
                <div class="listing-detail-left-col">
                    ${gallery}
                </div>

                <div class="listing-detail-right-col">
                    <h1 class="listing-detail-title">${project.projectName}</h1>

                    <div class="price-status-row">
                        <span class="listing-detail-price">From AED ${formatPrice(project.startingPrice)}</span>
                        ${project.goldenVisaEligible ? `<span class="status-pill" style="background:var(--brass); color:var(--emerald-deep);">🏆 Golden Visa</span>` : ''}
                    </div>

                    <div class="listing-detail-location">
                        <i class="fas fa-building"></i> ${project.developer} | ${project.community}
                    </div>

                    ${project.description ? `
                        <div class="listing-detail-card">
                            <h3 class="listing-detail-card-title">Description</h3>
                            <p class="listing-detail-description">${project.description}</p>
                        </div>
                    ` : ''}

                    ${hasHighlights ? `
                        <div class="listing-detail-card">
                            <h3 class="listing-detail-card-title">Key Highlights</h3>
                            <div class="listing-detail-features-grid">
                                ${project.highlights.map(h => `<span class="listing-detail-feature-item"><i class="fas fa-check-circle"></i> ${h}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="listing-detail-card">
                        <h3 class="listing-detail-card-title">Project Details</h3>
                        <div class="listing-detail-details-grid">
                            <div class="listing-detail-detail-item">
                                <span class="detail-label">Handover Date</span>
                                <span class="detail-value">${project.handoverDate || 'TBA'}</span>
                            </div>
                            ${hasTypes ? `
                                <div class="listing-detail-detail-item">
                                    <span class="detail-label">Unit Types</span>
                                    <span class="detail-value">${project.types.join(', ')}</span>
                                </div>
                            ` : ''}
                            ${paymentPlan.downPayment ? `
                                <div class="listing-detail-detail-item">
                                    <span class="detail-label">Down Payment</span>
                                    <span class="detail-value">${paymentPlan.downPayment}</span>
                                </div>
                            ` : ''}
                            ${paymentPlan.duringConstruction ? `
                                <div class="listing-detail-detail-item">
                                    <span class="detail-label">During Construction</span>
                                    <span class="detail-value">${paymentPlan.duringConstruction}</span>
                                </div>
                            ` : ''}
                            ${paymentPlan.onHandover ? `
                                <div class="listing-detail-detail-item">
                                    <span class="detail-label">On Handover</span>
                                    <span class="detail-value">${paymentPlan.onHandover}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="listing-detail-actions-card">
                        <h4 class="action-title">Interested in this project?</h4>
                        <p class="action-subtitle">Get the brochure or schedule a consultation</p>
                        <div class="listing-detail-actions">
                            <a href="https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(project.brochureWhatsApp || 'I\'m interested in this off-plan project')}" target="_blank" class="btn btn-whatsapp">
                                <i class="fab fa-whatsapp"></i> Request Brochure
                            </a>
                            <button class="btn btn-primary" onclick="window.scheduleConsultation('${project.projectName}')">
                                <i class="fas fa-calendar-check"></i> Schedule Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="trust-badges-full">
                <div class="trust-badges-inner">
                    <div class="trust-item">
                        <i class="fas fa-shield-alt"></i>
                        <div><strong>Secure Investment</strong><span>RERA approved off‑plan projects</span></div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-chart-line"></i>
                        <div><strong>High ROI Potential</strong><span>Prime locations with capital growth</span></div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-headset"></i>
                        <div><strong>Full Support</strong><span>From reservation to handover</span></div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-hand-holding-usd"></i>
                        <div><strong>Flexible Payment</strong><span>Developer payment plans available</span></div>
                    </div>
                    <div class="trust-item">
                        <i class="fas fa-percent"></i>
                        <div><strong>No Commission</strong><span>Direct from developer</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============= OFF-PLAN GALLERY FUNCTIONS =============

let offplanGalleryImages = [];
let offplanCurrentImageIndex = 0;
let offplanVisibleCount = 3;

window.setOffplanGalleryImage = function(index) {
    const images = offplanGalleryImages;
    if (!images || images.length === 0) return;
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    const mainImg = document.getElementById('offplan-gallery-main-image');
    if (!mainImg) return;
    offplanCurrentImageIndex = index;
    const counter = document.getElementById('offplan-gallery-counter');
    if (counter) {
        counter.textContent = `${index + 1} / ${images.length}`;
    }
    const thumbs = document.querySelectorAll('#offplan-gallery-thumbs .thumb:not(.more-photos)');
    thumbs.forEach((thumb, i) => {
        if (i < offplanVisibleCount && i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    transitionMainGalleryImage(mainImg, images[index], `Image ${index + 1}`);
};

window.prevOffplanImage = function() {
    window.setOffplanGalleryImage(offplanCurrentImageIndex - 1);
};

window.nextOffplanImage = function() {
    window.setOffplanGalleryImage(offplanCurrentImageIndex + 1);
};

function initOffplanGallery() {
    if (window.offplanGalleryImages && window.offplanGalleryImages.length > 0) {
        offplanGalleryImages = window.offplanGalleryImages;
    } else {
        const thumbs = document.querySelectorAll('#offplan-gallery-thumbs .thumb:not(.more-photos)');
        if (thumbs.length > 0) {
            offplanGalleryImages = Array.from(thumbs).map(thumb => thumb.src);
        } else {
            const mainImg = document.getElementById('offplan-gallery-main-image');
            if (mainImg) {
                offplanGalleryImages = [mainImg.src];
            }
        }
    }
    
    offplanCurrentImageIndex = 0;
    offplanVisibleCount = window.innerWidth >= 768 ? 4 : 3;
    
    const counter = document.getElementById('offplan-gallery-counter');
    if (counter && offplanGalleryImages.length > 0) {
        counter.textContent = `1 / ${offplanGalleryImages.length}`;
    }

    if (offplanGalleryController) {
        offplanGalleryController.abort();
    }
    offplanGalleryController = new AbortController();
    const signal = offplanGalleryController.signal;
    
    const prevBtn = document.getElementById('offplan-gallery-prev');
    const nextBtn = document.getElementById('offplan-gallery-next');
    const mainImg = document.getElementById('offplan-gallery-main-image');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', window.prevOffplanImage, { signal });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', window.nextOffplanImage, { signal });
    }

    document.querySelectorAll('#offplan-gallery-thumbs .thumb:not(.more-photos)').forEach((thumb) => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (!isNaN(index)) {
                window.setOffplanGalleryImage(index);
            }
        }, { signal });
    });
    
    const mainContainer = document.querySelector('#offplan-gallery-main');
    if (mainContainer) {
        let startX = 0, startY = 0;
        const touchStartHandler = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };
        const touchEndHandler = (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    window.prevOffplanImage();
                } else {
                    window.nextOffplanImage();
                }
            }
        };
        mainContainer.addEventListener('touchstart', touchStartHandler, { signal, passive: true });
        mainContainer.addEventListener('touchend', touchEndHandler, { signal, passive: true });
    }

    initHoverZoom('offplan-gallery-main', 'offplan-gallery-main-image');
}

window.scheduleConsultation = function(projectName) {
    navigateTo('contact');
    setTimeout(() => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="viewing"]')?.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.getElementById('tab-viewing')?.classList.add('active');
        const propertyInput = document.getElementById('view-property');
        if (propertyInput) propertyInput.value = 'Off-Plan: ' + projectName;
    }, 100);
};

// ============= RENDER COMMUNITIES =============

function renderHomeCommunities() {
    const container = document.getElementById('home-communities');
    if (!container) return;
    renderCommunities(communities.slice(0, 3), container); // <-- CHANGED: was 4, now 3
}

function renderCommunitiesPage() {
    const container = document.getElementById('communities-grid');
    if (!container) return;
    renderCommunities(communities, container);
}

function renderCommunities(communitiesData, container) {
    container.innerHTML = '';
    
    if (communitiesData.length === 0) {
        container.innerHTML = `
            <p class="no-results" style="grid-column:1/-1;text-align:center;padding:40px;">
                No communities found. Please check your API endpoint or add communities.
            </p>`;
        return;
    }
    
    communitiesData.forEach(community => {
        const card = document.createElement('div');
        card.className = 'community-card';
        
        const highlights = community.highlights && typeof community.highlights === 'string'
            ? community.highlights.split(',')
            : (Array.isArray(community.highlights) ? community.highlights : []);
        
        const imageUrl = community.image || 'https://placehold.co/800x600/0A1628/C9A84C?text=Community';
        
        card.innerHTML = `
            <div class="community-card-image">
                <img src="${imageUrl}" alt="${community.name}" loading="lazy">
                ${community.popular ? '<span class="community-badge popular">⭐ Popular</span>' : ''}
            </div>
            <div class="community-card-body">
                <h3>${community.name}</h3>
                <div class="community-type">${community.communityType}</div>
                <div class="community-prices">
                    ${community.avgApartmentPrice && community.avgApartmentPrice !== 'N/A' ? `<span>Apartments: <strong>${community.avgApartmentPrice}</strong></span>` : ''}
                    ${community.avgVillaPrice && community.avgVillaPrice !== 'N/A' ? `<span>Villas: <strong>${community.avgVillaPrice}</strong></span>` : ''}
                    <span>Yield: <strong>${community.avgRentalYield}</strong></span>
                </div>
                ${community.lifestyle ? `<p class="community-lifestyle">${community.lifestyle}</p>` : ''}
                <div class="community-highlights">
                    ${highlights.slice(0, 3).map(h => `<span class="highlight-tag">${h.trim()}</span>`).join('')}
                </div>
                <div class="community-actions">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.filterByCommunity('${community.name}')">View Properties</button>
                    <a href="https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(`Hi, I'm interested in properties in ${community.name}. I'd like to know more about the available options.`)}" target="_blank" class="btn btn-whatsapp btn-sm" onclick="event.stopPropagation();"><i class="fab fa-whatsapp"></i> Ask About</a>
                </div>
            </div>
        `;
        card.addEventListener('click', function(e) {
            if (e.target.closest('button') || e.target.closest('a')) return;
            window.viewCommunity(community.slug || community.id);
        });
        container.appendChild(card);
    });
}

// ============= COMMUNITY DETAIL FUNCTIONS =============

function renderCommunityDetail(community) {
    const highlights = Array.isArray(community.highlights) ? community.highlights : (community.highlights ? community.highlights.split(',').map(h => h.trim()).filter(Boolean) : []);
    const landmarks = Array.isArray(community.nearbyLandmarks) ? community.nearbyLandmarks : (community.nearbyLandmarks ? community.nearbyLandmarks.split(',').map(l => l.trim()).filter(Boolean) : []);
    const imageUrl = community.image || 'https://placehold.co/1200x600/0A1628/C9A84C?text=Community';

    const communityListings = listings.filter(l => l.community === community.name);
    const previewListings = communityListings.slice(0, 4);

    let propertiesHtml = '';
    if (previewListings.length === 0) {
        propertiesHtml = `<p class="no-results" style="text-align:center;padding:20px;">No properties currently listed in this community.</p>`;
    } else {
        propertiesHtml = `<div class="community-properties-grid">`;
        previewListings.forEach(listing => {
            const images = listing.images && typeof listing.images === 'string' 
                ? listing.images.split(',') 
                : (Array.isArray(listing.images) ? listing.images : []);
            const firstImage = images.length > 0 ? images[0] : 'https://placehold.co/600x400/0A1628/C9A84C?text=Property';
            propertiesHtml += `
                <div class="listing-card community-property-card">
                    <div class="listing-card-image">
                        <img src="${firstImage}" alt="${listing.title}" loading="lazy">
                        <div class="listing-card-badges">
                            ${listing.featured ? '<span class="badge badge-featured"><i class="fas fa-star"></i> FEATURED</span>' : ''}
                            <span class="badge badge-status">${listing.status.replace('-', ' ')}</span>
                            <span class="badge badge-type">${listing.type}</span>
                        </div>
                    </div>
                    <div class="listing-card-body">
                        <h3>${listing.title}</h3>
                        <div class="listing-card-price">AED ${formatPrice(listing.price)}</div>
                        <div class="listing-card-details">
                            <span><i class="fas fa-bed"></i> ${listing.bedrooms} bed</span>
                            <span><i class="fas fa-bath"></i> ${listing.bathrooms} bath</span>
                            <span><i class="fas fa-ruler-combined"></i> ${listing.sqft} sqft</span>
                        </div>
                        <div class="listing-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="window.viewListingPage('${listing.id}')">View Details</button>
                            <a href="https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(listing.whatsappText || 'I\'m interested in this property')}" target="_blank" class="btn btn-whatsapp btn-sm"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                        </div>
                    </div>
                </div>
            `;
        });
        propertiesHtml += `</div>`;
    }

    return `
        <div class="community-detail-page">
            <div class="community-detail-top-bar">
                <button type="button" class="btn btn-secondary community-detail-back-button" onclick="window.showCommunityList({ push: true })">
                    <i class="fas fa-arrow-left"></i> BACK TO COMMUNITIES
                </button>
                <div class="breadcrumb-nav">
                    <a href="#" onclick="window.navigateTo('home'); return false;">Home</a>
                    <span class="separator">/</span>
                    <a href="#" onclick="window.showCommunityList({ push: true }); return false;">Communities</a>
                    <span class="separator">/</span>
                    <span class="current">${community.name}</span>
                </div>
            </div>

            <div class="community-detail-hero" style="background-image:url('${imageUrl}');">
                <div class="community-detail-overlay">
                    <h1>${community.name}</h1>
                    <div class="community-type-badge">${community.communityType || 'Community'}</div>
                </div>
            </div>

            <div class="community-detail-body">
                ${community.description ? `<div class="community-detail-description"><p>${community.description}</p></div>` : ''}
                ${community.lifestyle ? `<div class="community-detail-description"><p><strong>Lifestyle:</strong> ${community.lifestyle}</p></div>` : ''}

                <div class="community-detail-stats">
                    ${community.avgApartmentPrice && community.avgApartmentPrice !== 'N/A' ? `
                        <div class="stat-item">
                            <span class="stat-label">Avg Apartment Price</span>
                            <span class="stat-value">${community.avgApartmentPrice}</span>
                        </div>
                    ` : ''}
                    ${community.avgVillaPrice && community.avgVillaPrice !== 'N/A' ? `
                        <div class="stat-item">
                            <span class="stat-label">Avg Villa Price</span>
                            <span class="stat-value">${community.avgVillaPrice}</span>
                        </div>
                    ` : ''}
                    ${community.avgRentalYield ? `
                        <div class="stat-item">
                            <span class="stat-label">Avg Rental Yield</span>
                            <span class="stat-value">${community.avgRentalYield}</span>
                        </div>
                    ` : ''}
                    ${community.avgRent1BR ? `
                        <div class="stat-item">
                            <span class="stat-label">Avg Rent 1BR</span>
                            <span class="stat-value">${community.avgRent1BR}</span>
                        </div>
                    ` : ''}
                    ${community.avgRent2BR ? `
                        <div class="stat-item">
                            <span class="stat-label">Avg Rent 2BR</span>
                            <span class="stat-value">${community.avgRent2BR}</span>
                        </div>
                    ` : ''}
                    ${community.metroStation ? `
                        <div class="stat-item">
                            <span class="stat-label">Metro Station</span>
                            <span class="stat-value">${community.metroStation}</span>
                        </div>
                    ` : ''}
                </div>

                ${highlights.length > 0 ? `
                    <div class="community-detail-section">
                        <h3>Highlights</h3>
                        <div class="community-detail-tags">
                            ${highlights.map(h => `<span class="tag">${h}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                ${landmarks.length > 0 ? `
                    <div class="community-detail-section">
                        <h3>Nearby Landmarks</h3>
                        <div class="community-detail-tags">
                            ${landmarks.map(l => `<span class="tag">${l}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="community-properties-section">
                    <h2><i class="fas fa-building" style="margin-right:10px;color:var(--brass);"></i>Properties in ${community.name}</h2>
                    ${propertiesHtml}
                    <div style="text-align:center; margin-top: 20px;">
                        <button class="btn btn-primary" onclick="window.filterByCommunity('${community.name}')">
                            <i class="fas fa-building" style="margin-right:8px;"></i> VIEW ALL PROPERTIES
                        </button>
                    </div>
                </div>

                <div class="community-detail-actions">
                    <a href="https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(`Hi, I'm interested in properties in ${community.name}. I'd like to know more about the available options.`)}" target="_blank" class="btn btn-whatsapp">
                        <i class="fab fa-whatsapp"></i> Ask About
                    </a>
                </div>
            </div>
        </div>
    `;
}

window.viewCommunity = function(slugOrId) {
    const community = communities.find(c => c.slug === slugOrId || String(c.id) === String(slugOrId));
    if (!community) {
        showToast('Community not found.', 'error');
        return;
    }
    navigateTo('community', { push: true, slug: community.slug || community.id });
};

window.showCommunityList = function(opts = {}) {
    const { push = true } = opts;
    const grid = document.getElementById('communities-grid');
    const detail = document.getElementById('community-detail');
    if (grid) grid.style.display = 'grid';
    if (detail) detail.style.display = 'none';
    if (push) {
        const path = buildPath('communities');
        if (location.pathname !== path) {
            history.pushState({ section: 'communities', slug: null, agentSlug: currentAgentSlug || null }, '', path);
            updateCanonical(path);
        }
    }
    document.title = 'Communities | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
    navigateTo('communities', { push: false });
};

// ============= ABOUT PAGE (DYNAMIC WITH AGENT + SALES) =============

function renderAboutPage() {
    // Testimonials
    const testimonialsContainer = document.getElementById('testimonials-grid');
    if (testimonialsContainer) {
        const testimonials = CONFIG.testimonials || [
            { name: 'Sarah Johnson', detail: 'Property Investor, UK', quote: 'Ahmed helped me find the perfect investment property in Dubai. His knowledge of off-plan projects and market trends is exceptional.' },
            { name: 'Michael Chen', detail: 'Business Owner, Singapore', quote: 'Professional, responsive, and truly understands luxury real estate. Made our property purchase seamless.' },
            { name: 'Emma Williams', detail: 'Expat, Australia', quote: 'From our first meeting to property handover, Ahmed provided outstanding service. Highly recommend for anyone buying in Dubai.' }
        ];
        
        testimonialsContainer.innerHTML = '';
        testimonials.forEach(t => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <div class="quote-mark">"</div>
                <div class="quote">${t.quote}</div>
                <div class="client">${t.name}</div>
                <div class="client-detail">${t.detail}</div>
            `;
            testimonialsContainer.appendChild(card);
        });
    }

    // Recent Sales - dynamic from API
    const salesContainer = document.getElementById('sales-grid');
    if (salesContainer) {
        salesContainer.innerHTML = '';
        
        if (!recentSales || recentSales.length === 0) {
            salesContainer.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:20px;color:var(--ink-soft);font-family:Inter, sans-serif;">No recent sales to display.</p>';
            return;
        }
        
        recentSales.forEach(sale => {
            const card = document.createElement('div');
            card.className = 'sale-card';
            const imageUrl = sale.image || 'https://placehold.co/600x400/0A1628/C9A84C?text=Sale';
            
            card.innerHTML = `
                <div class="sale-image-wrapper">
                    <img src="${imageUrl}" alt="${sale.propertyName}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/0A1628/C9A84C?text=Sale'">
                </div>
                <div class="sale-price">${sale.price}</div>
                <div class="sale-title">${sale.propertyName}</div>
                <div class="sale-detail">${sale.location}</div>
            `;
            salesContainer.appendChild(card);
        });
    }

    // Agent profile is already handled by updateConfigInDOM()
    // but we also update it from the agentsData if available
    if (agentsData && agentsData.length > 0) {
        const agent = agentsData[0];
        // Update name
        const nameEl = document.getElementById('agent-name-about');
        if (nameEl) nameEl.textContent = agent.agentName || 'Ahmed Khan';
        
        // Update photo
        const photoEl = document.getElementById('agent-photo-about');
        if (photoEl) photoEl.src = agent.photo || 'https://placehold.co/600x600/0A1628/C9A84C?text=Agent';
        
        // Update RERA
        const rernaEl = document.getElementById('rerna-number-about');
        if (rernaEl) rernaEl.textContent = agent.reraBRN || '123456';
        
        // Update bio
        const bioEl = document.getElementById('agent-full-bio');
        if (bioEl) bioEl.textContent = agent.bio || '';
        
        // Update stats
        const yearsEl = document.getElementById('years-exp-about');
        if (yearsEl) yearsEl.textContent = agent.yearsExperience || agent.experience || '12';
        const soldEl = document.getElementById('properties-sold-about');
        if (soldEl) soldEl.textContent = agent.propertiesSold || '850';
        // Happy clients - not in agent table, keep as is or use config
        const happyEl = document.getElementById('happy-clients-about');
        if (happyEl) happyEl.textContent = '1200';
        
        // Specialties
        const specialtiesContainer = document.getElementById('specialties-list');
        if (specialtiesContainer) {
            specialtiesContainer.innerHTML = '';
            if (agent.specialties) {
                agent.specialties.split(',').forEach(s => {
                    if (s.trim()) {
                        const tag = document.createElement('span');
                        tag.className = 'tag';
                        tag.textContent = s.trim();
                        specialtiesContainer.appendChild(tag);
                    }
                });
            }
        }
        
        // Languages
        const languagesContainer = document.getElementById('languages-list');
        if (languagesContainer) {
            languagesContainer.innerHTML = '';
            if (agent.languages) {
                agent.languages.split(',').forEach(l => {
                    if (l.trim()) {
                        const tag = document.createElement('span');
                        tag.className = 'tag language';
                        tag.textContent = l.trim();
                        languagesContainer.appendChild(tag);
                    }
                });
            }
        }
    }
}

// ============= BLOG FUNCTIONS =============

async function loadBlog() {
    try {
        const response = await fetch(`${API_BASE}/api/blog?t=${Date.now()}`);
        const data = await response.json();
        if (data.success) {
            blogPosts = data.posts;
            renderBlogGrid();
        }
    } catch (error) {
        console.error('Error loading blog:', error);
        const container = document.getElementById('blog-grid');
        if (container) {
            container.innerHTML = '<p class="no-results">Failed to load blog posts.</p>';
        }
    }
}

function renderBlogGrid() {
    const container = document.getElementById('blog-grid');
    if (!container) return;
    container.innerHTML = '';
    
    if (!blogPosts || blogPosts.length === 0) {
        container.innerHTML = '<p class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">No blog posts found. Check back soon!</p>';
        return;
    }
    
    blogPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        
        const imageUrl = post.featured_image || 'https://placehold.co/800x400/0A1628/C9A84C?text=Blog';
        const tags = post.tags && typeof post.tags === 'string' ? post.tags.split(',') : (Array.isArray(post.tags) ? post.tags : []);
        
        card.innerHTML = `
            <div class="blog-card-image">
                <img src="${imageUrl}" alt="${post.title}" loading="lazy">
                ${post.featured ? '<span class="blog-badge featured">Featured</span>' : ''}
            </div>
            <div class="blog-card-body">
                <div class="blog-card-meta">
                    <span class="blog-category">${post.category || 'Uncategorized'}</span>
                    <span class="blog-date">${formatDate(post.published_at || post.created_at)}</span>
                </div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                <div class="blog-card-footer">
                    <div class="blog-tags">
                        ${tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag.trim()}</span>`).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="window.viewBlogPost('${post.id}')">Read More</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

window.viewBlogPost = async function(idOrSlug, opts = {}) {
    const { push = true } = opts;
    const post = blogPosts.find(p => p.id == idOrSlug || p.slug === idOrSlug);
    if (!post) {
        showToast('Post not found.', 'error');
        return;
    }
    
    currentBlogPost = post;

    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.getElementById('blog')?.classList.add('active');
    document.querySelectorAll('.nav-menu a, .footer-links a').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.section === 'blog') el.classList.add('active');
    });
    currentSection = 'blog';
    
    document.getElementById('blog-grid').style.display = 'none';
    const detailContainer = document.getElementById('blog-detail');
    detailContainer.style.display = 'block';

    if (push) {
        const slugOrId = post.slug || post.id;
        const path = buildPath('blog', slugOrId);
        if (location.pathname !== path) {
            history.pushState({ section: 'blog', slug: slugOrId }, '', path);
        }
        updateCanonical(path);
    }
    document.title = post.title + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
    
    const content = document.getElementById('blog-detail-content');
    const tags = post.tags && typeof post.tags === 'string' ? post.tags.split(',') : (Array.isArray(post.tags) ? post.tags : []);
    
    content.innerHTML = `
        <div class="blog-detail">
            ${post.featured_image ? `<div class="blog-detail-image"><img src="${post.featured_image}" alt="${post.title}"></div>` : ''}
            <div class="blog-detail-header">
                <div class="blog-detail-meta">
                    <span class="blog-category">${post.category || 'Uncategorized'}</span>
                    <span class="blog-date">${formatDate(post.published_at || post.created_at)}</span>
                    <span class="blog-author">By ${post.author || 'Admin'}</span>
                    <span class="blog-views">👁️ ${post.views || 0} views</span>
                </div>
                <h1 class="blog-detail-title">${post.title}</h1>
                ${post.excerpt ? `<p class="blog-detail-excerpt">${post.excerpt}</p>` : ''}
            </div>
            <div class="blog-detail-body">
                ${post.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
            </div>
            ${tags.length > 0 ? `
                <div class="blog-detail-tags">
                    <h4>Tags</h4>
                    <div class="blog-tags">
                        ${tags.map(tag => `<span class="blog-tag">${tag.trim()}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            <div class="blog-detail-share">
                <h4>Share this post</h4>
                <div class="share-buttons">
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" target="_blank" class="share-btn linkedin"><i class="fab fa-linkedin-in"></i></a>
                    <a href="https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}" target="_blank" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
};

window.showBlogList = function(opts = {}) {
    const { push = true } = opts;
    document.getElementById('blog-grid').style.display = 'grid';
    document.getElementById('blog-detail').style.display = 'none';
    currentBlogPost = null;
    document.title = 'Blog | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');

    if (push) {
        const path = buildPath('blog');
        if (location.pathname !== path) {
            history.pushState({ section: 'blog', slug: null }, '', path);
        }
        updateCanonical(path);
    }
};

// ============= FILTER FUNCTIONS =============

function filterListings() {
    const type = document.getElementById('filter-type-listings')?.value || 'all';
    const bedrooms = document.getElementById('filter-bedrooms-listings')?.value || 'all';
    const price = document.getElementById('filter-price-listings')?.value || 'all';
    const community = document.getElementById('filter-community-listings')?.value || 'all';
    const status = document.getElementById('filter-status-listings')?.value || 'all';
    const search = document.getElementById('filter-search')?.value?.toLowerCase() || '';
    
    let filtered = [...listings];
    
    if (type !== 'all') filtered = filtered.filter(l => l.type === type);
    if (bedrooms !== 'all') {
        const b = parseInt(bedrooms);
        filtered = filtered.filter(l => l.bedrooms >= b);
    }
    if (price !== 'all') {
        const p = price;
        if (p === '500k') filtered = filtered.filter(l => l.price < 500000);
        else if (p === '1m') filtered = filtered.filter(l => l.price >= 500000 && l.price < 1000000);
        else if (p === '2m') filtered = filtered.filter(l => l.price >= 1000000 && l.price < 2000000);
        else if (p === '5m') filtered = filtered.filter(l => l.price >= 2000000 && l.price < 5000000);
        else if (p === '10m') filtered = filtered.filter(l => l.price >= 5000000 && l.price < 10000000);
        else if (p === '10m+') filtered = filtered.filter(l => l.price >= 10000000);
    }
    if (community !== 'all') filtered = filtered.filter(l => l.community === community);
    if (status !== 'all') filtered = filtered.filter(l => l.status === status);
    if (search) {
        filtered = filtered.filter(l => 
            l.title.toLowerCase().includes(search) ||
            l.community.toLowerCase().includes(search) ||
            (l.description && l.description.toLowerCase().includes(search))
        );
    }
    
    const container = document.getElementById('listings-grid');
    if (container) {
        renderListings(filtered, container);
    }
}

window.filterByCommunity = function(communityName) {
    const communitySelect = document.getElementById('filter-community-listings');
    if (communitySelect) {
        communitySelect.value = communityName;
        navigateTo('listings', { push: true, query: { community: communityName } });
        filterListings();
    } else {
        navigateTo('listings', { push: true, query: { community: communityName } });
    }
};

function applyCommunityFilterFromURL() {
    const queryParams = new URLSearchParams(location.search);
    const communityParam = queryParams.get('community');
    if (communityParam) {
        const communitySelect = document.getElementById('filter-community-listings');
        if (communitySelect && communities.some(c => c.name === communityParam)) {
            communitySelect.value = communityParam;
            filterListings();
        }
    }
}

function populateCommunityFilter() {
    const filterSelect = document.getElementById('filter-community-listings');
    if (filterSelect) {
        const currentValue = filterSelect.value;
        filterSelect.innerHTML = '<option value="all">All Communities</option>';
        communities.forEach(c => {
            const option = document.createElement('option');
            option.value = c.name;
            option.textContent = c.name;
            filterSelect.appendChild(option);
        });
        filterSelect.value = currentValue;
    }
    
    const valSelect = document.getElementById('val-community');
    if (valSelect) {
        const currentVal = valSelect.value;
        valSelect.innerHTML = '<option value="">Select Community</option>';
        communities.forEach(c => {
            const option = document.createElement('option');
            option.value = c.name;
            option.textContent = c.name;
            valSelect.appendChild(option);
        });
        valSelect.value = currentVal;
    }

    const heroCommunitySelect = document.getElementById('filter-community-hero');
    if (heroCommunitySelect) {
        const currentHeroVal = heroCommunitySelect.value;
        heroCommunitySelect.innerHTML = '<option value="all">All Communities</option>';
        communities.forEach(c => {
            const option = document.createElement('option');
            option.value = c.name;
            option.textContent = c.name;
            heroCommunitySelect.appendChild(option);
        });
        heroCommunitySelect.value = currentHeroVal;
    }
}

// ============= VIEW LISTING DETAIL (LEGACY MODAL SUPPORT) =============

window.viewListing = function(id, opts = {}) {
    window.viewListingPage(id, opts);
};

window.closeModal = function() {
    document.getElementById('modal').style.display = 'none';
    currentListingId = null;
};

window.scheduleViewing = function(property) {
    navigateTo('contact');
    setTimeout(() => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="viewing"]')?.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.getElementById('tab-viewing')?.classList.add('active');
        
        const propertyInput = document.getElementById('view-property');
        if (propertyInput) propertyInput.value = property;
    }, 100);
};

// ============= ROI CALCULATOR =============

function calculateROI() {
    const price = parseFloat(document.getElementById('calc-price').value);
    const rent = parseFloat(document.getElementById('calc-rent').value);
    const service = parseFloat(document.getElementById('calc-service').value);
    
    if (!price || !rent) {
        showToast('Please enter property price and annual rent.', 'error');
        return;
    }
    
    const grossYield = (rent / price) * 100;
    const netRent = rent - service;
    const netYield = (netRent / price) * 100;
    const annualReturn = netRent;
    
    const results = document.getElementById('calc-results');
    results.innerHTML = `
        <div class="result-item"><span>Property Price</span><span class="value">AED ${formatPrice(price)}</span></div>
        <div class="result-item"><span>Annual Rent</span><span class="value">AED ${formatPrice(rent)}</span></div>
        <div class="result-item"><span>Service Charges</span><span class="value">AED ${formatPrice(service)}</span></div>
        <div class="result-item"><span>Gross Yield</span><span class="value">${grossYield.toFixed(2)}%</span></div>
        <div class="result-item"><span>Net Yield</span><span class="value">${netYield.toFixed(2)}%</span></div>
        <div class="result-item"><span>Annual Net Return</span><span class="value">AED ${formatPrice(annualReturn)}</span></div>
    `;
    results.classList.add('show');
}

// ============= FORM SUBMISSIONS =============

function submitForm(formId, endpoint, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.site_id = 'agentwebstudio';
        if (currentAgentSlug) {
            data.agentSlug = currentAgentSlug;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
        
        try {
            const response = await fetch(`${API_BASE}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast(successMessage, 'success');
                form.reset();
            } else {
                showToast('There was an error submitting the form. Please try again or contact us directly.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Network error. Please check your connection.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
}

// ============= UTILITY FUNCTIONS =============

function formatPrice(price) {
    if (!price) return '0';
    if (price >= 1000000) {
        return (price / 1000000).toFixed(1) + 'M';
    }
    return price.toLocaleString();
}

function formatDate(date) {
    if (!date) return 'N/A';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return 'N/A';
    }
}

// ============= SPA NAVIGATION =============

function navigateTo(sectionId, opts = {}) {
    const { push = true, slug = null, query = null } = opts;

    const currentRoute = parseCurrentRoute();
    if ((sectionId === 'listings' || sectionId === 'offplan') && 
        currentRoute.section === sectionId && currentRoute.slug) {
        const detailId = sectionId === 'listings' ? 'listing-detail' : 'offplan-detail';
        const gridId = sectionId === 'listings' ? 'listings-grid' : 'offplan-grid';
        const filterBar = document.getElementById('filter-bar');
        
        const gridEl = document.getElementById(gridId);
        if (gridEl) gridEl.style.display = 'grid';
        const detailEl = document.getElementById(detailId);
        if (detailEl) detailEl.style.display = 'none';
        if (filterBar) filterBar.style.display = 'grid';
        
        const path = buildPath(sectionId);
        if (query) {
            const qs = new URLSearchParams(query).toString();
            const newPath = path + (qs ? '?' + qs : '');
            if (location.pathname + location.search !== newPath) {
                history.pushState({ section: sectionId, slug: null, agentSlug: currentAgentSlug || null, query: query }, '', newPath);
                updateCanonical(newPath);
            }
        } else {
            if (location.pathname !== path) {
                history.pushState({ section: sectionId, slug: null, agentSlug: currentAgentSlug || null }, '', path);
                updateCanonical(path);
            }
        }
        
        document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');
        
        document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, .nav-link, [data-section]').forEach(el => {
            el.classList.remove('active');
            if (el.dataset && el.dataset.section === sectionId) {
                el.classList.add('active');
            }
        });
        
        const sectionNames = {
            home: currentAgentData?.siteName || config.siteName || 'Agent Web Studio - Luxury Real Estate Dubai',
            listings: 'Properties | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
            offplan: 'Off-Plan Projects | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
            communities: 'Communities | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
            about: 'About | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
            contact: 'Contact | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
            valuation: 'Valuation | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
            goldenvisa: 'Golden Visa | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
            blog: 'Blog | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio')
        };
        document.title = sectionNames[sectionId] || currentAgentData?.siteName || config.siteName || 'Agent Web Studio';
        
        if (sectionId === 'listings') {
            filterListings();
            populateCommunityFilter();
            if (query && query.community) {
                const communitySelect = document.getElementById('filter-community-listings');
                if (communitySelect && communities.some(c => c.name === query.community)) {
                    communitySelect.value = query.community;
                    filterListings();
                }
            }
        } else if (sectionId === 'offplan') {
            renderOffplanPage();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    document.querySelectorAll('.section').forEach(el => {
        el.classList.remove('active');
    });
    
    if (sectionId === 'community' && slug) {
        const community = communities.find(c => c.slug === slug || String(c.id) === String(slug));
        if (community) {
            const communitiesSection = document.getElementById('communities');
            if (communitiesSection) communitiesSection.classList.add('active');
            
            document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, .nav-link, [data-section]').forEach(el => {
                el.classList.remove('active');
                if (el.dataset && el.dataset.section === 'communities') {
                    el.classList.add('active');
                }
            });
            
            const grid = document.getElementById('communities-grid');
            const detail = document.getElementById('community-detail');
            if (grid) grid.style.display = 'none';
            if (detail) {
                detail.style.display = 'block';
                const detailContent = document.getElementById('community-detail-content');
                detailContent.innerHTML = renderCommunityDetail(community);
                const backButton = detailContent.querySelector('.community-detail-back-button');
                if (backButton) {
                    backButton.addEventListener('click', () => window.showCommunityList({ push: true }));
                }
            }
            
            document.title = community.name + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
            
            if (push) {
                const path = buildPath('community', community.slug || community.id);
                if (location.pathname !== path) {
                    history.pushState({ section: 'community', slug: community.slug || community.id, agentSlug: currentAgentSlug || null }, '', path);
                    updateCanonical(path);
                }
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    }
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    } else if (sectionId === 'home') {
        const homeSection = document.getElementById('home');
        if (homeSection) homeSection.classList.add('active');
    }

    if (sectionId !== 'community') {
        document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, .nav-link, [data-section]').forEach(el => {
            el.classList.remove('active');
            if (el.dataset && el.dataset.section === sectionId) {
                el.classList.add('active');
            }
            if (el.getAttribute('href') && el.getAttribute('href').includes(sectionId)) {
                el.classList.add('active');
            }
        });
    }

    document.querySelectorAll('.floating-nav a').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.section === sectionId) {
            el.classList.add('active');
        }
    });

    currentSection = sectionId;

    if (sectionId === 'blog') {
        const grid = document.getElementById('blog-grid');
        const detail = document.getElementById('blog-detail');
        if (grid) grid.style.display = 'grid';
        if (detail) detail.style.display = 'none';
        currentBlogPost = null;
    }

    if (sectionId === 'listings') {
        const { section, slug: routeSlug } = parseCurrentRoute();
        const filterBar = document.getElementById('filter-bar');
        
        if (routeSlug && section === 'listings') {
            const listing = listings.find(l => l.id == routeSlug || String(l.id) === String(routeSlug));
            if (listing) {
                const grid = document.getElementById('listings-grid');
                const detail = document.getElementById('listing-detail');
                if (grid) grid.style.display = 'none';
                if (filterBar) filterBar.style.display = 'none';
                if (detail) {
                    detail.style.display = 'block';
                    document.getElementById('listing-detail-content').innerHTML = renderListingDetail(listing);
                    setTimeout(initGallery, 100);
                }
                document.title = listing.title + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
                return;
            }
        }
        const grid = document.getElementById('listings-grid');
        const detail = document.getElementById('listing-detail');
        if (grid) grid.style.display = 'grid';
        if (filterBar) filterBar.style.display = 'grid';
        if (detail) detail.style.display = 'none';
    }

    if (sectionId === 'offplan') {
        const { section, slug: routeSlug } = parseCurrentRoute();
        if (routeSlug && section === 'offplan') {
            const project = offplan.find(p => p.id == routeSlug || String(p.id) === String(routeSlug));
            if (project) {
                const grid = document.getElementById('offplan-grid');
                const detail = document.getElementById('offplan-detail');
                if (grid) grid.style.display = 'none';
                if (detail) {
                    detail.style.display = 'block';
                    document.getElementById('offplan-detail-content').innerHTML = renderOffplanDetail(project);
                    setTimeout(initOffplanGallery, 100);
                }
                document.title = project.projectName + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
                return;
            }
        }
        const grid = document.getElementById('offplan-grid');
        const detail = document.getElementById('offplan-detail');
        if (grid) grid.style.display = 'grid';
        if (detail) detail.style.display = 'none';
        renderOffplanPage();
    }

    if (sectionId === 'communities') {
        const grid = document.getElementById('communities-grid');
        const detail = document.getElementById('community-detail');
        if (grid) grid.style.display = 'grid';
        if (detail) detail.style.display = 'none';
        renderCommunitiesPage();
    }

    const sectionNames = {
        home: currentAgentData?.siteName || config.siteName || 'Agent Web Studio - Luxury Real Estate Dubai',
        listings: 'Properties | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
        offplan: 'Off-Plan Projects | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
        communities: 'Communities | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
        about: 'About | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
        contact: 'Contact | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
        valuation: 'Valuation | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
        goldenvisa: 'Golden Visa | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio'),
        blog: 'Blog | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio')
    };
    document.title = sectionNames[sectionId] || currentAgentData?.siteName || config.siteName || 'Agent Web Studio';

    if (sectionId === 'listings') {
        populateCommunityFilter();
        filterListings();
        if (query && query.community) {
            const communitySelect = document.getElementById('filter-community-listings');
            if (communitySelect && communities.some(c => c.name === query.community)) {
                communitySelect.value = query.community;
                filterListings();
            }
        }
    } else if (sectionId === 'valuation') {
        populateCommunityFilter();
    } else if (sectionId === 'home') {
        renderFeaturedListings();
        renderFeaturedOffplan();
        renderHomeCommunities();
    } else if (sectionId === 'offplan') {
        renderOffplanPage();
    } else if (sectionId === 'communities') {
        renderCommunitiesPage();
    } else if (sectionId === 'about') {
        renderAboutPage();
    } else if (sectionId === 'blog') {
        loadBlog();
    }

    if (push) {
        let path;
        if (sectionId === 'home' && currentAgentSlug) {
            path = '/' + currentAgentSlug;
        } else {
            path = buildPath(sectionId, slug);
        }
        if (query && Object.keys(query).length > 0) {
            const qs = new URLSearchParams(query).toString();
            path += '?' + qs;
        }
        if (location.pathname + location.search !== path) {
            history.pushState({ section: sectionId, slug: slug || null, agentSlug: currentAgentSlug || null, query: query || null }, '', path);
        }
        updateCanonical(path);
    }

    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    if (navMenu) navMenu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= MOBILE MENU =============

function toggleMobileMenu() {
    document.getElementById('nav-menu')?.classList.toggle('active');
    document.getElementById('hamburger')?.classList.toggle('active');
}

// ============= RTL TOGGLE =============

function toggleRTL() {
    isRTL = !isRTL;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    const langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.textContent = isRTL ? 'AR' : 'EN';
    localStorage.setItem('ak_rtl', isRTL ? 'true' : 'false');
}

// ============= FAQ ACCORDION =============

function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            if (answer) answer.classList.toggle('show');
        });
    });
}

// ============= KEYBOARD NAVIGATION =============

document.addEventListener('keydown', function(e) {
    const listingDetail = document.getElementById('listing-detail');
    const offplanDetail = document.getElementById('offplan-detail');
    if (listingDetail && listingDetail.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            window.prevImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            window.nextImage();
        }
    } else if (offplanDetail && offplanDetail.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            window.prevOffplanImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            window.nextOffplanImage();
        }
    }
});

// ============= ROUTING HANDLER =============

function handleRoute() {
    const { section, slug, agentSlug } = parseCurrentRoute();

    if (agentSlug) {
        currentAgentSlug = agentSlug;
        localStorage.setItem(DEFAULT_AGENT_SLUG_KEY, agentSlug);
    } else {
        const stored = localStorage.getItem(DEFAULT_AGENT_SLUG_KEY);
        if (stored) {
            currentAgentSlug = stored;
            const targetPath = buildPath(section, slug);
            if (location.pathname !== targetPath) {
                history.replaceState({ section, slug, agentSlug: stored }, '', targetPath);
                handleRoute();
                return;
            }
        } else {
            fetch(`${API_BASE}/api/agents`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.agents.length > 0) {
                        const defaultSlug = data.agents[0].slug;
                        currentAgentSlug = defaultSlug;
                        localStorage.setItem(DEFAULT_AGENT_SLUG_KEY, defaultSlug);
                        const targetPath = buildPath(section, slug);
                        history.replaceState({ section, slug, agentSlug: defaultSlug }, '', targetPath);
                        handleRoute();
                    } else {
                        currentAgentSlug = 'ahmed-khan';
                        localStorage.setItem(DEFAULT_AGENT_SLUG_KEY, currentAgentSlug);
                        const targetPath = buildPath(section, slug);
                        history.replaceState({ section, slug, agentSlug: currentAgentSlug }, '', targetPath);
                        handleRoute();
                    }
                })
                .catch(() => {
                    currentAgentSlug = 'ahmed-khan';
                    localStorage.setItem(DEFAULT_AGENT_SLUG_KEY, currentAgentSlug);
                    const targetPath = buildPath(section, slug);
                    history.replaceState({ section, slug, agentSlug: currentAgentSlug }, '', targetPath);
                    handleRoute();
                });
            return;
        }
    }

    if (listings.length === 0 || communities.length === 0) {
        loadAllData().then(() => {
            showSection(section, slug);
        });
        return;
    }
    showSection(section, slug);
}

function showSection(section, slug) {
    if (section === 'community' && slug) {
        const community = communities.find(c => c.slug === slug || String(c.id) === String(slug));
        if (community) {
            document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
            document.getElementById('communities')?.classList.add('active');
            
            document.getElementById('communities-grid').style.display = 'none';
            document.getElementById('community-detail').style.display = 'block';
            document.getElementById('community-detail-content').innerHTML = renderCommunityDetail(community);
            document.title = community.name + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
            document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
                el.classList.remove('active');
                if (el.dataset && el.dataset.section === 'communities') {
                    el.classList.add('active');
                }
            });
            return;
        } else {
            showNotFound('Community');
            return;
        }
    } else if (section === 'community') {
        document.getElementById('communities-grid').style.display = 'grid';
        document.getElementById('community-detail').style.display = 'none';
        renderCommunitiesPage();
        document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
        document.getElementById('communities')?.classList.add('active');
        document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
            el.classList.remove('active');
            if (el.dataset && el.dataset.section === 'communities') {
                el.classList.add('active');
            }
        });
        return;
    }

    if (section === 'listings' && slug) {
        const listing = listings.find(l => l.id == slug || String(l.id) === String(slug));
        if (listing) {
            document.getElementById('listings-grid').style.display = 'none';
            document.getElementById('listing-detail').style.display = 'block';
            document.getElementById('listing-detail-content').innerHTML = renderListingDetail(listing);
            document.title = listing.title + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
            document.getElementById('filter-bar').style.display = 'none';
            setTimeout(initGallery, 100);
            document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
            document.getElementById('listings')?.classList.add('active');
            document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
                el.classList.remove('active');
                if (el.dataset && el.dataset.section === 'listings') {
                    el.classList.add('active');
                }
            });
            return;
        } else {
            showNotFound('Listing');
            return;
        }
    } else if (section === 'listings') {
        document.getElementById('listings-grid').style.display = 'grid';
        document.getElementById('listing-detail').style.display = 'none';
        document.getElementById('filter-bar').style.display = 'grid';
        filterListings();
        document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
        document.getElementById('listings')?.classList.add('active');
        document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
            el.classList.remove('active');
            if (el.dataset && el.dataset.section === 'listings') {
                el.classList.add('active');
            }
        });
        applyCommunityFilterFromURL();
        return;
    }

    if (section === 'offplan' && slug) {
        const project = offplan.find(p => p.id == slug || String(p.id) === String(slug));
        if (project) {
            document.getElementById('offplan-grid').style.display = 'none';
            document.getElementById('offplan-detail').style.display = 'block';
            document.getElementById('offplan-detail-content').innerHTML = renderOffplanDetail(project);
            document.title = project.projectName + ' | ' + (currentAgentData?.siteName || config.siteName || 'Agent Web Studio');
            setTimeout(initOffplanGallery, 100);
            document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
            document.getElementById('offplan')?.classList.add('active');
            document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
                el.classList.remove('active');
                if (el.dataset && el.dataset.section === 'offplan') {
                    el.classList.add('active');
                }
            });
            return;
        } else {
            showNotFound('Off-Plan Project');
            return;
        }
    } else if (section === 'offplan') {
        document.getElementById('offplan-grid').style.display = 'grid';
        document.getElementById('offplan-detail').style.display = 'none';
        renderOffplanPage();
        document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
        document.getElementById('offplan')?.classList.add('active');
        document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
            el.classList.remove('active');
            if (el.dataset && el.dataset.section === 'offplan') {
                el.classList.add('active');
            }
        });
        return;
    }

    if (section === 'blog' && slug) {
        window.viewBlogPost(slug, { push: false });
        return;
    } else if (section === 'blog') {
        document.getElementById('blog-grid').style.display = 'grid';
        document.getElementById('blog-detail').style.display = 'none';
        loadBlog();
        document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
        document.getElementById('blog')?.classList.add('active');
        document.querySelectorAll('.nav-menu a, .footer-links a, .floating-nav a, [data-section]').forEach(el => {
            el.classList.remove('active');
            if (el.dataset && el.dataset.section === 'blog') {
                el.classList.add('active');
            }
        });
        return;
    }

    navigateTo(section, { push: false, slug });
}

// ============= INIT =============

document.addEventListener('DOMContentLoaded', async function() {
    await loadAllData();
    handleRoute();
    hidePreloader();

    const rtlStored = localStorage.getItem('ak_rtl');
    if (rtlStored === 'true') {
        isRTL = true;
        document.documentElement.dir = 'rtl';
        const langToggle = document.getElementById('langToggle');
        if (langToggle) langToggle.textContent = 'AR';
    }
    
    document.querySelectorAll('[data-section]').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            if (section) {
                navigateTo(section);
                document.getElementById('nav-menu')?.classList.remove('active');
                document.getElementById('hamburger')?.classList.remove('active');
            }
        });
    });
    
    document.getElementById('hamburger')?.addEventListener('click', toggleMobileMenu);
    document.getElementById('langToggle')?.addEventListener('click', toggleRTL);
    document.getElementById('calc-roi-btn')?.addEventListener('click', calculateROI);
    
    document.querySelectorAll('#calc-price, #calc-rent, #calc-service').forEach(input => {
        input.addEventListener('keypress', function(e) { if (e.key === 'Enter') calculateROI(); });
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`tab-${tab}`)?.classList.add('active');
        });
    });
    
    initFAQ();
    
    submitForm('inquiry-form', 'leads/contact', 'Thank you! Your inquiry has been sent. We will respond within 24 hours.');
    submitForm('viewing-form', 'leads/viewing', 'Thank you! Your viewing request has been submitted. We will confirm the time shortly.');
    submitForm('valuation-form', 'leads/valuation', 'Thank you! Your valuation request has been submitted. We will get back to you within 24 hours.');
    submitForm('goldenvisa-form', 'leads/goldenvisa', 'Thank you! Your Golden Visa consultation request has been submitted. We will contact you shortly.');
    
    document.querySelectorAll('.filter-bar select, .filter-bar input').forEach(el => {
        el.addEventListener('change', filterListings);
        el.addEventListener('keyup', function(e) { if (e.key === 'Enter') filterListings(); });
    });
    
    document.getElementById('modal-close')?.addEventListener('click', () => window.closeModal());
    document.getElementById('modal-cancel')?.addEventListener('click', () => window.closeModal());
    window.addEventListener('click', function(e) { if (e.target === document.getElementById('modal')) window.closeModal(); });

    window.addEventListener('popstate', function() {
        document.getElementById('modal').style.display = 'none';
        handleRoute();
    });

    const filterBar = document.getElementById('filter-bar');
    const listingDetail = document.getElementById('listing-detail');
    if (listingDetail && listingDetail.style.display === 'block') {
        if (filterBar) filterBar.style.display = 'none';
    } else {
        if (filterBar) filterBar.style.display = 'grid';
    }

    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// ============= EXPOSE FOR GLOBAL USE =============
window.listings = listings;
window.offplan = offplan;
window.communities = communities;
window.blogPosts = blogPosts;
window.config = config;
window.agentProfile = agentProfile;
window.currentAgentData = currentAgentData;
window.currentAgentSlug = currentAgentSlug;
window.loadAllData = loadAllData;
window.formatPrice = formatPrice;
window.filterListings = filterListings;
window.filterByCommunity = filterByCommunity;
window.navigateTo = navigateTo;
window.viewListing = window.viewListing;
window.viewListingPage = window.viewListingPage;
window.showListingList = window.showListingList;
window.scheduleViewing = window.scheduleViewing;
window.closeModal = window.closeModal;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleRTL = toggleRTL;
window.CONFIG = CONFIG;
window.viewBlogPost = window.viewBlogPost;
window.showBlogList = window.showBlogList;
window.loadBlog = loadBlog;
window.renderListingDetail = renderListingDetail;
window.setGalleryImage = setGalleryImage;
window.prevImage = prevImage;
window.nextImage = nextImage;
window.initGallery = initGallery;
window.viewOffplanPage = viewOffplanPage;
window.showOffplanList = showOffplanList;
window.renderOffplanDetail = renderOffplanDetail;
window.scheduleConsultation = scheduleConsultation;
window.setOffplanGalleryImage = setOffplanGalleryImage;
window.prevOffplanImage = prevOffplanImage;
window.nextOffplanImage = nextOffplanImage;
window.initOffplanGallery = initOffplanGallery;
window.openGalleryModal = openGalleryModal;
window.viewCommunity = viewCommunity;
window.showCommunityList = showCommunityList;
window.applyCommunityFilterFromURL = applyCommunityFilterFromURL;
window.recentSales = recentSales;
window.agentsData = agentsData;
