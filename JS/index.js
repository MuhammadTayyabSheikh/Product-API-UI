$(function () {
    loadProducts();
    $("#addBtn").click(addProduct);
    $("#products").on("click", ".btn-danger", handleDelete);
    $("#products").on("click", ".btn-warning", handleUpdate);
    $("#updateBtn").click(function () {
        // alert("Starting Sending Update");
        var id = $("#updateId").val();
        var name = $("#update-name").val();
        var color = $("#update-color").val();
        var price = $("#update-price").val();
        var department = $("#update-department").val();
        var description = $("#update-description").val();
        // console.log(id + name + color + price + department + description);
        $.ajax({
            url: "https://usman-recipes.herokuapp.com/api/products/" + id,
            data: {
                id, name, color, price, department, description
            },
            method: "PUT",
            success: function (response) {
                alert("Success Sending Update");
                // console.log(response);
                loadProducts();
                // alert("Success Loading " + response);
                $("#updateProductModal").modal("hide");
            }
        });
    });
});

function addProduct() {
    // console.log("Adding")
    var name = $("#product-name").val();
    var color = $("#product-color").val();
    var price = $("#product-price").val();
    var department = $("#product-department").val();
    var description = $("#product-description").val();
    // console.log("Before Adding This is productsd details", color, department, description, name, price);
    $.ajax({
        url: "https://usman-recipes.herokuapp.com/api/products",
        method: "POST",
        data: { name, color, price, department, description },
        success: function (response) {
            // console.log(response);
            $("product-name").val("");
            $("product-color").val("");
            $("product-price").val("");
            $("product-department").val("");
            $("product-description").val("");
            $("#addProductModal").modal("hide");
            loadProducts();
        }
    });
}

var apikey = key = "563492ad6f917000010000011a6e36f421b749ddaeb15a778922ce43";

function getPic(productsEl, productsResp) {

    let n = productsResp.name.split(" ");
    if (n.length >= 1)
        n = productsResp.name.split(" ").slice(-1);
    else {
        n = productsResp.name
    }
    // console.log(n);

    $.ajax({
        url: "https://pixabay.com/api/?key=26193608-9735016660277b06f9c33ce21&q=" + n,
        // url: `https://api.pexels.com/v1/search?query=${productsResp.name.split(" ").slice(-1)}&page=${Math.floor(Math.random() * 2)
        // }`,
        method: "GET",
        // headers: {
        //     Accept: "application/json",
        //     Authorization: apikey,
        // },
        error: function (response) {
            alert("Error Occured")
        },
        success: function (response) {
            // console.log(response);
            let pictureLink = "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/rm140-mynt-09_1.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=c162b634b23b23d52e06fc367e130d91";
            if (response.hits.length > 1)
                pictureLink = response.hits[Math.floor(Math.random() * 3)].webformatURL;
            productsEl.append(`
            <div class="product card mx-3 my-0 h-25 w-25" data-id="${productsResp._id}">
                <img src="${pictureLink}" class="card-img-top" alt="...">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${productsResp.name}</h5>
                    <p class="card-text">${productsResp.description}</p>
                    <p class="card-text"><strong>Category: ${productsResp.department}</strong></p>
                    <strong class="card-text">Price: $${productsResp.price}</strong>
                    </br>
                    <div>
                        <button class="delete btn btn-warning btn-sm ">Update</button>
                        <button class="btn btn-danger btn-sm ">Delete</button>
                    </div>
                </div>
            </div>
                `);
        }
    });
}

function loadProducts() {
    $.ajax({
        url: "https://usman-recipes.herokuapp.com/api/products",
        method: "GET",
        error: function (response) {
            var products = $("#products");
            products.html("An Error has occured");
        },
        success: function (response) {
            // console.log(response);
            var products = $("#products");
            $("#products").empty();
            for (var i = 0; i < response.length; i++) {
                var rec = response[i];
                getPic(products, rec);
            }
        }
    });
}

function handleDelete() {
    // alert("Starting Delete.");
    var btn = $(this);
    var parentDiv = btn.closest(".product");
    let id = parentDiv.attr("data-id");
    id = "https://usman-recipes.herokuapp.com/api/products/" + id;
    // alert("Step 1 => id = " + id);
    $.ajax({
        url: id,
        type: "DELETE",
        error: function (response) {
            alert("Error Deleting", response);
        },
        success: function (response) {
            // alert("Step 2.", response, id);
            loadProducts();
            // console.log("After Deletion.", id);
        }
    });
}

function handleUpdate() {
    // alert("Starting Update.");
    var btn = $(this);
    var parentDiv = btn.closest(".product");
    let id = parentDiv.attr("data-id");
    id = "https://usman-recipes.herokuapp.com/api/products/" + id;
    // alert("Step 1 => id = " + id);
    $.ajax({
        url: id,
        type: "GET",
        error: function (response) {
            alert("Error Updating", response);
        },
        success: function (response) {
            // alert("Step 2."+ response.name);
            $("#updateProductModal").modal('show');
            $("#updateId").val(response._id);
            $("#update-name").val(response.name);
            $("#update-color").val(response.color);
            $("#update-price").val(response.price);
            $("#update-department").val(response.department);
            $("#update-description").val(response.description);
            // alert("After Putting in Modal.", id);
        }
    });

    // $.get("https://usman-recipes.herokuapp.com/api/products/" + id, function (response) {
    //     alert("Updating");

    //     $("#addProductModal").modal('show');
    //     $("#updateId").val(response._id);
    //     $("#update-name").val(response.name);
    //     $("#update-color").val(response.color);
    //     $("#update-price").val(response.price);
    //     $("#update-department").val(response.department);
    //     $("#update-description").val(response.description);

    // });
}