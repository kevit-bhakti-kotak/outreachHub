
//   const contacts = JSON.parse(localStorage.getItem('contacts')) || []; //

//   contacts.forEach((contact, index) => renderContact(contact, index));

//   document.querySelector('.btn').addEventListener("click", addContact);

//   function addContact() {
//     const name = document.getElementById('name').value.trim();
//     const phone = document.getElementById('phone').value.trim();
//     const tagsInput = document.getElementById('tags').value.trim();

//     if (!name || !phone) {
//       alert('Name and phone number are required.');
//       return;
//     }

//     const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
//     const newContact = { name, phone, tags };
//     contacts.push(newContact);
//     localStorage.setItem('contacts', JSON.stringify(contacts));
//     renderContact(newContact, contacts.length - 1);

//     document.getElementById('name').value = '';
//     document.getElementById('phone').value = '';
//     document.getElementById('tags').value = '';
//   }

//   function renderContact(contact, index) {
//     const tableBody = document.getElementById('contactsTable');
//     const row = document.createElement('tr');

//     const nameTd = document.createElement('td');
//     nameTd.textContent = contact.name;

//     const phoneTd = document.createElement('td');
//     phoneTd.textContent = contact.phone;

//     const tagsTd = document.createElement('td');
//     tagsTd.innerHTML = contact.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');

//     const actionsTd = document.createElement('td');
//     actionsTd.className = 'actions';

//     const editBtn = document.createElement('button');
//     editBtn.textContent = 'Edit';
//     editBtn.addEventListener('click', () => editContact(index));

//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = 'Delete';
//     deleteBtn.addEventListener('click', () => deleteContact(index));

//     actionsTd.appendChild(editBtn);
//     actionsTd.appendChild(deleteBtn);

//     row.appendChild(nameTd);
//     row.appendChild(phoneTd);
//     row.appendChild(tagsTd);
//     row.appendChild(actionsTd);

//     tableBody.appendChild(row);
//   }

// //   function editContact(index) {
// //     alert('Edit function for contact #' + index + ' goes here.');
// //   }

// //   function deleteContact(index) {
// //     alert('Delete function for contact #' + index + ' goes here.');
// //   }



 let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
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
        document.getElementById('phone').value = c.phone;
        document.getElementById('tags').value = c.tags.join(', ');
      } else {
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('tags').value = '';
      }
    }

    function submitContact() {
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
        alert('Please enter a valid phone number (10-15 digits, optionally starting with +).');
        return;
      }

      const newContact = { name, phone, tags };
      if (editIndex >= 0) {
        contacts[editIndex] = newContact;
      } else {
        contacts.push(newContact);
      }

      localStorage.setItem('contacts', JSON.stringify(contacts));
      renderContacts();
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
          <td>${contact.phone}</td>
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
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          if (confirm('Are you sure you want to delete this contact?')) {
            contacts.splice(index, 1);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            renderContacts();
          }
        });
      });
    }

    renderContacts();