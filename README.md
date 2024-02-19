### GoContract
This software application captures the ever-growing need for contractors to connect to clients on the Internet. Many contracting services, such as HVAC, Plumbing, Yardworkers, etc., have difficulties communicating with and finding new clients. GoContract, the effortless contracting software, makes all these tasks straightforward and efficient.

### Service Registry:
The service registry is a central database that stores a list of services that are provided by the service provider. Services can be added or removed, and these will be updated on the service registry.

The service consumer can search for a service on the service registry. For example, they could search for a booking service to book a contractor. If such a service is found and exists, it is invoked from the registry.

The service provider can register services on the service registry. Services can be added or removed and will be consequently updated on the registry while maintaining the integrity of the application. This will allow for modular design, and implementation of new services or modifiability of existing ones without impacting the software.

### Service Consumer:
The service consumers are able to interact with the service registry by queries. The service consumer is divided based on whether the user is a client or contractor, and each consumer accomplishes different things. The queries will be returned by the service registry, and corresponding services will be displayed by the service provider.

### Find Contractor Search Engine GUI
The service consumer for the client will provide a GUI that allows the user to search through the list of contractors in the service registry. The user has a list of services they want filtered out, and only those services will be displayed for any existing contractor. For example, if the user wishes to filter by contractors that they have an active contract with, then those corresponding contractors will be displayed, and nothing else. If the registry holds the contractor that is searched, it finds the available services registered to that contractor (such as book, rate, etc). This is sent back to the service consumer and displays buttons for each service that that contractor provides. Each button is bound to the service in the service provider that is available, and if clicked, takes the user to the corresponding service in the service provider.

### Find Search Booked Clients GUI
The service consumer for the contractor will provide a GUI that allows the user to search through the list of clients attached to them in the service registry. The user has a list of services they want filtered out, and only those services will be displayed for any existing client. If the registry holds the client that is searched, it finds the available services registered to that contractor (such as manage, rate, etc). This is sent back to the service consumer and displays buttons for each service that that client is attached to. Each button is bound to the service in the service provider that is available, and if clicked, takes the user to the corresponding service in the service provider.

### Service Provider:
Finally, the service provider consists of the GUI that the service consumers will use. It consists of the application and handles creating bookings and adding contractor/client information that will be sent to and stored in the service registry. The service provider will have a GUI that will allow the implementation of the following microservices.

### Add/Remove Contractor Service
ID: S1 Title: Contract Manager Description: This service allows contractors to add or remove themselves from the service consumer for the clients. When a client filters for contractors using the Find Contractor Search Engine GUI, the contractor will be displayed based on whether the contractor added or removed themselves using this service.

### Manage Booking Service
ID: S2 Title: Booking Manager Description: This service lets the contractors accept/decline booking requests from potential clients and lets contractors and clients manage their bookings for specific clients to allow them to check/modify them. When a contractor uses the Find Search Booked Client Service GUI to see specific booked clients, they will be redirected to the bookings manager upon clicking a specific booking. If changes are made, this is updated in the database containing information about the bookings.

### Contract Invoice Service
ID: S3 Title: Contract Invoice Service Description: This service lets the contractors upload an invoice for the specific client in their client search. The contractor can put information such as length of contract, pricing, etc., which is stored in the database. This will automatically generate a message that is sent directly within the app to the corresponding client that includes the invoice and details about the contract they received. The client, through the client consumer search, can find invoices of completed contracts.

### Book Contractor Service
ID: S4 Title: Book Contractor Service Description: This service lets clients book a specific contractor contract from the respective contractor service’s timeslots. When a service has been booked by a client, the booking will be reflected in the Manage Booking Service (S2) of the contractor, and the booking will be registered in the service registry so that both clients and contractors can access services. Since clients are booking contracts, these new contracts will be reflected in the Find Contractor Search Engine GUI and the Find Search Booked Client GUI, where the respective client or contractor will be displayed.

### Rate Service
ID: S5 Title: Contractor Rater Description: This service lets the customers rate a contractor they worked with. Through a 5-star system, the user can add comments and provide a numeric rating that details their satisfaction with their work with the contractors. This service also allows customers to modify/delete their ratings. If a consumer uses the Find Contractor Search Engine GUI, they will be able to filter for contractors by their ratings through the 5-star system.
