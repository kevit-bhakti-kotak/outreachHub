
//  let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
const token = localStorage.getItem("token");

if (!token) {
  alert("You must be logged in to view this page.");
  window.location.href = "login.html";
}


let contacts = [];

async function fetchContacts() {
  try{
  const res = await fetch('http://localhost:3000/contacts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
   const response = await res.json();
   contacts = response.data;
  
  renderContacts();
 }catch(err){
  console.error('Error fetching contacts:', err);
  alert('Failed to fetch contacts. Please try again later.');
  localStorage.removeItem('jwt_token');
  window.location.href = 'login.html';
 } // display the data in the table
}

    let editIndex = -1;

    document.getElementById('addContactBtn').addEventListener('click', () => toggleForm());
    document.getElementById('saveContactBtn').addEventListener('click', submitContact);

    function toggleForm(edit = false, index = -1) {
      const formCard = document.getElementById('contactFormCard');
      const formTitle = document.getElementById('formTitle');
      const listCard = document.getElementById('contactListCard');

      formCard.style.display = 'block';
      listCard.style.display = 'none';
      formTitle.textContent = edit ? 'Edit Contact' : 'Add Contact';
      editIndex = index;

      if (edit && index >= 0) {
        const c = contacts[index];
        document.getElementById('name').value = c.name;
        document.getElementById('phone').value = c.phoneNumber;
        document.getElementById('tags').value = c.tags.join(', ');
      } else {
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('tags').value = '';
      }
    }

    async function submitContact() {
      if (!confirm('Are you sure you want to save this contact?')) return;

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const phonePattern = /^\+?\d{10}$/;
      const tags = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t);

      if (!name || !phone) {
        alert('Name and phone are required.');
        return;
      }

      if (!phonePattern.test(phone)) {
        alert('Please enter a valid phone number.');
        return;
      }

      const newContact = { name, phoneNumber:phone, tags };
      // if (editIndex >= 0) {
      //   contacts[editIndex] = newContact;
      // } else {
      //   contacts.push(newContact);
      // }
      if (editIndex >= 0)/**  if exisiting */ {
    const contactId = contacts[editIndex].id;
    await fetch(`http://localhost:3000/contacts/${contactId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newContact)
    });
  } else {
    await fetch(`http://localhost:3000/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
      body: JSON.stringify(newContact)
    });
  }

      // localStorage.setItem('contacts', JSON.stringify(contacts));
      // renderContacts();

      await fetchContacts();
      document.getElementById('contactFormCard').style.display = 'none';
      document.getElementById('contactListCard').style.display = 'block';
    }

    function renderContacts() {
      const table = document.getElementById('contactsTable');
      table.innerHTML = '';
      contacts.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${contact.name}</td>
          <td>${contact.phoneNumber}</td>
          <td>${contact.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</td>
          <td class="actions">
            <button data-index="${index}" class="editBtn">Edit</button>
            <button data-index="${index}" class="deleteBtn">Delete</button>
          </td>
        `;
        table.appendChild(row);
      });

      document.querySelectorAll('.editBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          toggleForm(true, index);
          // if (confirm('Do you want to edit this contact?')) toggleForm(true, index);
        });
      });

     document.querySelectorAll('.deleteBtn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const index = parseInt(e.target.getAttribute('data-index'));
    const contact = contacts[index];
    if (confirm('Are you sure you want to delete this contact?')) {
      await fetch(`http://localhost:3000/contacts/${contact.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchContacts();
    }
  });
});


    }

    fetchContacts();